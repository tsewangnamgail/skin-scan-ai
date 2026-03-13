import React, { useState, useCallback } from "react";
import { Shield, Activity, AlertCircle, Loader2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import ResultCard from "@/components/ResultCard";

interface PredictionResult {
  prediction: string;
  confidence: number;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit. Please select a smaller image.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  }, [previewUrl]);

  const handlePredict = useCallback(async () => {
    if (!selectedImage) {
      setError("Please upload an image before running the analysis.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error (${response.status}). Please try again.`);
      }

      const data = await response.json();
      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3">
          <div className="rounded-lg gradient-medical p-2">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              AI-Based Skin Cancer Detection
            </h1>
            <p className="text-xs text-muted-foreground">
              Powered by Deep Learning • For Educational Use Only
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Instructions */}
        <div className="mb-6 rounded-lg border border-border bg-secondary/50 p-4">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                How it works
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload a dermatoscopic image of a skin lesion, then click{" "}
                <span className="font-medium text-foreground">Analyze Image</span>{" "}
                to get an AI-powered prediction with a confidence score.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <section>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              1. Upload Image
            </h2>
            <ImageUpload
              onImageSelect={handleImageSelect}
              onClear={handleClear}
              selectedImage={selectedImage}
              previewUrl={previewUrl}
              disabled={isLoading}
            />
          </section>

          {/* Predict Button */}
          <section>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              2. Run Analysis
            </h2>
            <button
              onClick={handlePredict}
              disabled={!selectedImage || isLoading}
              className={`
                w-full py-3 px-6 rounded-lg font-semibold text-sm
                transition-all duration-200 ease-in-out
                flex items-center justify-center gap-2
                ${
                  !selectedImage || isLoading
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "gradient-medical text-primary-foreground hover:opacity-90 active:scale-[0.99] shadow-card hover:shadow-elevated"
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Image"
              )}
            </button>
          </section>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <section>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                3. Result
              </h2>
              <ResultCard
                prediction={result.prediction}
                confidence={result.confidence}
              />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <p className="text-xs text-muted-foreground text-center">
            This tool is for educational and research purposes only. It does not
            provide medical diagnoses. Always consult a healthcare professional.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
