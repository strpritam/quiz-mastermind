import { useState, useCallback } from 'react';
import { Question, QuizSettings, QuizResult, QuizState } from '@/types/quiz';
import { toast } from '@/hooks/use-toast';

const AZURE_FUNCTION_URL = import.meta.env.VITE_AZURE_FUNCTION_URL || '';

export function useQuiz() {
  const [state, setState] = useState<QuizState>('upload');
  const [syllabusContent, setSyllabusContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [settings, setSettings] = useState<QuizSettings>({
    questionCount: 15,
    marksPerQuestion: 1,
    negativeMarking: 0.25,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const text = await file.text();
      setSyllabusContent(text);
      setFileName(file.name);
      setState('settings');
      toast({
        title: "File uploaded successfully!",
        description: `${file.name} has been processed.`,
      });
    } catch (error) {
      toast({
        title: "Error reading file",
        description: "Please try again with a valid text file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!AZURE_FUNCTION_URL) {
        // Demo mode - generate sample questions
        const sampleQuestions: Question[] = Array.from({ length: settings.questionCount }, (_, i) => ({
          id: `q-${i + 1}`,
          question: `Sample Question ${i + 1}: Based on your syllabus content, what is the correct answer?`,
          options: [
            `Option A for question ${i + 1}`,
            `Option B for question ${i + 1}`,
            `Option C for question ${i + 1}`,
            `Option D for question ${i + 1}`,
          ],
          correctAnswer: Math.floor(Math.random() * 4),
        }));
        setQuestions(sampleQuestions);
        toast({
          title: "Demo Mode",
          description: "Configure Azure Function URL to generate real questions.",
        });
      } else {
        const response = await fetch(AZURE_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: syllabusContent,
            questionCount: settings.questionCount,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate questions');
        }

        const data = await response.json();
        setQuestions(data.questions);
      }

      setStartTime(Date.now());
      setState('quiz');
    } catch (error) {
      toast({
        title: "Error generating questions",
        description: "Please check your Azure configuration and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [syllabusContent, settings.questionCount]);

  const answerQuestion = useCallback((answerIndex: number) => {
    setQuestions(prev => 
      prev.map((q, i) => 
        i === currentQuestionIndex 
          ? { ...q, userAnswer: answerIndex }
          : q
      )
    );
  }, [currentQuestionIndex]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  const submitQuiz = useCallback(() => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach(q => {
      if (q.userAnswer === undefined) {
        skipped++;
      } else if (q.userAnswer === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const totalMarks = questions.length * settings.marksPerQuestion;
    const obtainedMarks = (correct * settings.marksPerQuestion) - (wrong * settings.negativeMarking);
    const percentage = Math.max(0, (obtainedMarks / totalMarks) * 100);

    const quizResult: QuizResult = {
      totalQuestions: questions.length,
      attempted: questions.length - skipped,
      correct,
      wrong,
      skipped,
      totalMarks,
      obtainedMarks: Math.max(0, obtainedMarks),
      percentage,
      timeTaken,
      questions,
    };

    setResult(quizResult);
    setState('result');
  }, [questions, settings, startTime]);

  const resetQuiz = useCallback(() => {
    setState('upload');
    setSyllabusContent('');
    setFileName('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResult(null);
  }, []);

  return {
    state,
    syllabusContent,
    fileName,
    settings,
    setSettings,
    questions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    isLoading,
    result,
    handleFileUpload,
    generateQuestions,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    submitQuiz,
    resetQuiz,
    setState,
  };
}
