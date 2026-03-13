import React, { useState, useCallback } from "react";
import { Loader2, Brain } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ImageUpload from "@/components/ImageUpload";
import ResultCard from "@/components/ResultCard";
import { predictImage, type PredictionResult } from "@/utils/api";

const PredictionPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
  }, [previewUrl]);

  const handlePredict = useCallback(async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);
    try {
      const result = await predictImage(selectedImage);
      setPrediction(result);
    } catch {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedImage]);

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg gradient-medical p-2.5">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Skin Cancer Prediction</h1>
            <p className="text-sm text-muted-foreground">Upload a dermoscopic image for AI-powered analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ImageUpload
              onImageSelect={handleImageSelect}
              onClear={handleClear}
              selectedImage={selectedImage}
              previewUrl={previewUrl}
              disabled={loading}
            />
            <button
              onClick={handlePredict}
              disabled={!selectedImage || loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                !selectedImage || loading
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "gradient-medical text-primary-foreground hover:opacity-90 shadow-card"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Predict"
              )}
            </button>
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <div>
            {prediction ? (
              <ResultCard prediction={prediction.prediction} confidence={prediction.confidence} />
            ) : (
              <div className="rounded-lg border border-dashed border-border p-12 text-center h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Upload an image and click <span className="font-semibold text-foreground">Predict</span> to see results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PredictionPage;
