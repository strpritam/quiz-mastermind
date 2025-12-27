import { QuizSettings as QuizSettingsType } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, ArrowLeft, Play, HelpCircle, Target, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizSettingsProps {
  settings: QuizSettingsType;
  onSettingsChange: (settings: QuizSettingsType) => void;
  onStart: () => void;
  onBack: () => void;
  fileName: string;
  isLoading: boolean;
}

const questionOptions = [15, 20, 30] as const;

export function QuizSettings({ 
  settings, 
  onSettingsChange, 
  onStart, 
  onBack, 
  fileName,
  isLoading 
}: QuizSettingsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-slide-up">
      {/* File Info */}
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Uploaded File</p>
            <p className="font-medium font-display">{fileName}</p>
          </div>
        </div>
      </Card>

      {/* Question Count Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-display font-semibold flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Number of Questions
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {questionOptions.map((count) => (
            <button
              key={count}
              onClick={() => onSettingsChange({ ...settings, questionCount: count })}
              className={cn(
                "relative p-6 rounded-xl border-2 transition-all duration-300",
                "hover:border-primary hover:shadow-md",
                settings.questionCount === count
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "border-border bg-card"
              )}
            >
              <span className="text-3xl font-display font-bold">{count}</span>
              <p className="text-sm text-muted-foreground mt-1">Questions</p>
              {settings.questionCount === count && (
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Marking Info */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Marks per Question</p>
              <p className="text-2xl font-display font-bold text-success">+1</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Negative Marking</p>
              <p className="text-2xl font-display font-bold text-destructive">-0.25</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Total Marks Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Total Marks</p>
          <p className="text-4xl font-display font-bold text-gradient">
            {settings.questionCount * settings.marksPerQuestion}
          </p>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onStart}
          className="flex-1 bg-gradient-primary hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Quiz
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
