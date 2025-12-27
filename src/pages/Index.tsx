import { useQuiz } from '@/hooks/useQuiz';
import { FileUpload } from '@/components/quiz/FileUpload';
import { QuizSettings } from '@/components/quiz/QuizSettings';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizResult } from '@/components/quiz/QuizResult';
import { Brain, Sparkles } from 'lucide-react';

const Index = () => {
  const {
    state,
    fileName,
    settings,
    setSettings,
    questions,
    currentQuestionIndex,
    currentQuestion,
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
  } = useQuiz();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">QuizMaster AI</h1>
              <p className="text-xs text-muted-foreground">Powered by Azure</p>
            </div>
          </div>

          {state !== 'upload' && state !== 'result' && (
            <button
              onClick={resetQuiz}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Only on Upload */}
          {state === 'upload' && (
            <div className="text-center mb-12 pt-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Quiz Generation
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                Turn Your Syllabus Into
                <span className="text-gradient block">Interactive Quizzes</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your study material and let AI generate customized practice questions. 
                Track your performance with detailed analytics.
              </p>
            </div>
          )}

          {/* State-based Content */}
          {state === 'upload' && (
            <FileUpload
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
              fileName={fileName}
            />
          )}

          {state === 'settings' && (
            <QuizSettings
              settings={settings}
              onSettingsChange={setSettings}
              onStart={generateQuestions}
              onBack={() => setState('upload')}
              fileName={fileName}
              isLoading={isLoading}
            />
          )}

          {state === 'quiz' && currentQuestion && (
            <QuizQuestion
              question={currentQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              onAnswer={answerQuestion}
              onNext={nextQuestion}
              onPrev={prevQuestion}
              onSubmit={submitQuiz}
              onGoToQuestion={goToQuestion}
              allQuestions={questions}
            />
          )}

          {state === 'result' && result && (
            <QuizResult result={result} onRestart={resetQuiz} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 text-center text-sm text-muted-foreground">
        <p>© 2024 QuizMaster AI. Built with Azure OpenAI.</p>
      </footer>
    </div>
  );
};

export default Index;
