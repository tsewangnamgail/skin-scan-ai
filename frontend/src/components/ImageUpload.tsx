import React, { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onClear: () => void;
  selectedImage: File | null;
  previewUrl: string | null;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onClear,
  selectedImage,
  previewUrl,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [disabled, onImageSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
      // Reset so same file can be re-selected
      e.target.value = "";
    },
    [onImageSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled) fileInputRef.current?.click();
  }, [disabled]);

  if (previewUrl && selectedImage) {
    return (
      <div className="relative w-full rounded-lg border-2 border-border bg-card overflow-hidden shadow-card">
        <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-muted/50">
          <img
            src={previewUrl}
            alt="Selected skin image for analysis"
            className="max-h-full max-w-full object-contain p-4"
          />
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 min-w-0">
            <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">
              {selectedImage.name}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              ({(selectedImage.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          {!disabled && (
            <button
              onClick={onClear}
              className="ml-2 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative w-full rounded-lg border-2 border-dashed cursor-pointer
        transition-all duration-200 ease-in-out
        ${isDragOver
          ? "border-accent bg-accent/5 scale-[1.01]"
          : "border-border hover:border-accent/50 hover:bg-muted/50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="mb-4 rounded-full bg-secondary p-3">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          Drag & drop a skin image here
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          or click to browse files
        </p>
        <p className="text-xs text-muted-foreground">
          Supports JPG, PNG, WEBP • Max 10MB
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ImageUpload;
