export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

export interface QuizSettings {
  questionCount: 15 | 20 | 30;
  marksPerQuestion: number;
  negativeMarking: number;
}

export interface QuizResult {
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  timeTaken: number;
  questions: Question[];
}

export type QuizState = 'upload' | 'settings' | 'quiz' | 'result';
