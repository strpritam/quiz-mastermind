import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  fileName?: string;
}

export function FileUpload({ onFileUpload, isLoading, fileName }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer",
          "hover:border-primary hover:bg-primary/5",
          isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-border",
          isLoading && "pointer-events-none opacity-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".txt,.pdf,.doc,.docx,.md"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
            isDragging ? "bg-gradient-primary shadow-glow" : "bg-secondary"
          )}>
            {isLoading ? (
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className={cn(
                "w-10 h-10 transition-colors",
                isDragging ? "text-primary-foreground" : "text-muted-foreground"
              )} />
            )}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-display font-semibold mb-2">
              {isLoading ? "Processing..." : "Upload Your Syllabus"}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your syllabus file here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground/70">
              Supports: TXT, PDF, DOC, DOCX, MD
            </p>
          </div>

          {fileName && (
            <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg">
              <FileText className="w-4 h-4" />
              <span className="font-medium">{fileName}</span>
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-primary opacity-20 rounded-full blur-2xl" />
        <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-accent opacity-20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
