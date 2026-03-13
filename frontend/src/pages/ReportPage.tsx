import React, { useState, useCallback } from "react";
import { Loader2, FileText, Brain, Calculator } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ImageUpload from "@/components/ImageUpload";
import RiskCalculator from "@/components/RiskCalculator";
import ReportGenerator from "@/components/ReportGenerator";
import { predictImage, calculateRisk, type PredictionResult, type RiskResult, type RiskFormData } from "@/utils/api";

const ReportPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [riskForm, setRiskForm] = useState<RiskFormData>({
    age: "",
    skinType: "",
    sunburns: "",
    familyHistory: "",
    sunExposure: "",
  });

  const handleImageSelect = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
    setRiskResult(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    setPrediction(null);
    setRiskResult(null);
    setError(null);
  }, [previewUrl]);

  const handleGenerate = useCallback(async () => {
    if (!selectedImage) {
      setError("Please upload an image first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Step 1: Predict
      const predRes = await predictImage(selectedImage);
      setPrediction(predRes);

      // Step 2: Risk based on the actual prediction
      try {
        const riskRes = await calculateRisk(predRes.prediction, predRes.confidence);
        setRiskResult(riskRes);
      } catch {
        // Risk failure is non-fatal — report can still be generated
      }
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
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Medical Report</h1>
            <p className="text-sm text-muted-foreground">Generate and download a comprehensive AI diagnostic report</p>
          </div>
        </div>

        {!prediction ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Brain className="h-4 w-4 text-accent" />
                Upload Image
              </h2>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onClear={handleClear}
                selectedImage={selectedImage}
                previewUrl={previewUrl}
                disabled={loading}
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Calculator className="h-4 w-4 text-accent" />
                Risk Factors (Optional)
              </h2>
              <RiskCalculator formData={riskForm} onChange={setRiskForm} disabled={loading} />
            </div>
          </div>
        ) : null}

        {!prediction && (
          <button
            onClick={handleGenerate}
            disabled={!selectedImage || loading}
            className={`py-3 px-8 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${!selectedImage || loading
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
              "Run Analysis & Generate Report"
            )}
          </button>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {prediction && (
          <ReportGenerator
            prediction={prediction.prediction}
            confidence={prediction.confidence}
            riskScore={riskResult?.risk_score ?? null}
            riskLevel={riskResult?.risk_level ?? null}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default ReportPage;
