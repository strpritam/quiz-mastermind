import { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Flag, Check } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onGoToQuestion: (index: number) => void;
  allQuestions: Question[];
}

export function QuizQuestion({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onNext,
  onPrev,
  onSubmit,
  onGoToQuestion,
  allQuestions,
}: QuizQuestionProps) {
  const optionLabels = ['A', 'B', 'C', 'D'];
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const answeredCount = allQuestions.filter(q => q.userAnswer !== undefined).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Navigation Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {allQuestions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => onGoToQuestion(i)}
            className={cn(
              "w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200",
              i === currentIndex
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : q.userAnswer !== undefined
                ? "bg-success/20 text-success border border-success/30"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <Card className="p-8 bg-card/90 backdrop-blur-sm border-border/50 shadow-lg">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Question {currentIndex + 1}
          </span>
          <h2 className="text-xl md:text-2xl font-display font-semibold leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left transition-all duration-300",
                "hover:border-primary hover:bg-primary/5 hover:shadow-md",
                "flex items-center gap-4",
                question.userAnswer === index
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-border bg-card"
              )}
            >
              <span className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-lg transition-colors",
                question.userAnswer === index
                  ? "bg-gradient-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}>
                {optionLabels[index]}
              </span>
              <span className="flex-1 font-medium">{option}</span>
              {question.userAnswer === index && (
                <Check className="w-5 h-5 text-primary animate-scale-in" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={onSubmit}
            className="flex-1 bg-gradient-accent hover:opacity-90"
          >
            <Flag className="w-4 h-4 mr-2" />
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
