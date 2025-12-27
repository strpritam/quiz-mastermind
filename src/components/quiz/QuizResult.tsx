import { QuizResult as QuizResultType } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Trophy, 
  Target, 
  XCircle, 
  MinusCircle, 
  Clock, 
  RotateCcw,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

interface QuizResultProps {
  result: QuizResultType;
  onRestart: () => void;
}

export function QuizResult({ result, onRestart }: QuizResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-success', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-success', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', color: 'text-accent', message: 'Good Job!' };
    if (percentage >= 60) return { grade: 'C', color: 'text-warning', message: 'Keep Practicing!' };
    if (percentage >= 50) return { grade: 'D', color: 'text-warning', message: 'Needs Improvement' };
    return { grade: 'F', color: 'text-destructive', message: 'Try Again!' };
  };

  const gradeInfo = getGrade(result.percentage);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary shadow-glow mb-6 animate-bounce-subtle">
          <Trophy className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
          Quiz Completed!
        </h1>
        <p className={cn("text-xl font-medium", gradeInfo.color)}>
          {gradeInfo.message}
        </p>
      </div>

      {/* Score Card */}
      <Card className="p-8 bg-gradient-to-br from-card to-secondary/50 border-border/50 text-center">
        <div className="mb-6">
          <span className={cn("text-7xl font-display font-bold", gradeInfo.color)}>
            {gradeInfo.grade}
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <p className="text-4xl font-display font-bold text-gradient">
              {result.obtainedMarks.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Obtained</p>
          </div>
          <span className="text-2xl text-muted-foreground">/</span>
          <div className="text-center">
            <p className="text-4xl font-display font-bold text-muted-foreground">
              {result.totalMarks}
            </p>
            <p className="text-sm text-muted-foreground">Total Marks</p>
          </div>
        </div>

        <div className="relative h-4 bg-secondary rounded-full overflow-hidden mb-2">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-primary transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(result.percentage, 100)}%` }}
          />
        </div>
        <p className="text-lg font-medium">
          {result.percentage.toFixed(1)}% Score
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-card/80">
          <Target className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-display font-bold">{result.attempted}</p>
          <p className="text-sm text-muted-foreground">Attempted</p>
        </Card>

        <Card className="p-4 text-center bg-card/80">
          <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
          <p className="text-2xl font-display font-bold text-success">{result.correct}</p>
          <p className="text-sm text-muted-foreground">Correct</p>
        </Card>

        <Card className="p-4 text-center bg-card/80">
          <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-2xl font-display font-bold text-destructive">{result.wrong}</p>
          <p className="text-sm text-muted-foreground">Wrong</p>
        </Card>

        <Card className="p-4 text-center bg-card/80">
          <MinusCircle className="w-8 h-8 text-warning mx-auto mb-2" />
          <p className="text-2xl font-display font-bold text-warning">{result.skipped}</p>
          <p className="text-sm text-muted-foreground">Skipped</p>
        </Card>
      </div>

      {/* Time Taken */}
      <Card className="p-6 bg-card/80 flex items-center justify-center gap-4">
        <Clock className="w-6 h-6 text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">Time Taken</p>
          <p className="text-xl font-display font-bold">{formatTime(result.timeTaken)}</p>
        </div>
      </Card>

      {/* Answer Review Toggle */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide' : 'Show'} Answer Details
        {showDetails ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
      </Button>

      {/* Answer Details */}
      {showDetails && (
        <div className="space-y-4 animate-slide-up">
          {result.questions.map((q, i) => {
            const isCorrect = q.userAnswer === q.correctAnswer;
            const isSkipped = q.userAnswer === undefined;

            return (
              <Card 
                key={q.id} 
                className={cn(
                  "p-4 border-l-4",
                  isSkipped 
                    ? "border-l-warning" 
                    : isCorrect 
                    ? "border-l-success" 
                    : "border-l-destructive"
                )}
              >
                <div className="flex items-start gap-4">
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                    isSkipped 
                      ? "bg-warning/20 text-warning" 
                      : isCorrect 
                      ? "bg-success/20 text-success" 
                      : "bg-destructive/20 text-destructive"
                  )}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-2">{q.question}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-success">
                        ✓ Correct: {['A', 'B', 'C', 'D'][q.correctAnswer]}. {q.options[q.correctAnswer]}
                      </p>
                      {!isSkipped && !isCorrect && (
                        <p className="text-destructive">
                          ✗ Your answer: {['A', 'B', 'C', 'D'][q.userAnswer!]}. {q.options[q.userAnswer!]}
                        </p>
                      )}
                      {isSkipped && (
                        <p className="text-warning">— Skipped</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Restart Button */}
      <Button
        onClick={onRestart}
        className="w-full bg-gradient-primary hover:opacity-90"
        size="lg"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Take Another Quiz
      </Button>
    </div>
  );
}
