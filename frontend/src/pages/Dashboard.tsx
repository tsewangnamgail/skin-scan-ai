import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import ResultCard from "@/components/ResultCard";
import HeatmapViewer from "@/components/HeatmapViewer";
import RiskCalculator from "@/components/RiskCalculator";
import RiskResultCard from "@/components/RiskResultCard";
import Chatbot from "@/components/Chatbot";
import ReportGenerator from "@/components/ReportGenerator";
import AnalysisProgress from "@/components/AnalysisProgress";
import {
  predictImage,
  getGradCam,
  calculateRisk,
  type PredictionResult,
  type GradCamResult,
  type RiskResult,
  type RiskFormData,
} from "@/utils/api";

type StepStatus = "pending" | "loading" | "done" | "error";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [gradcam, setGradcam] = useState<GradCamResult | null>(null);
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);

  const [riskForm, setRiskForm] = useState<RiskFormData>({
    age_group: "young adult",
    skin_type: "Medium",
    sunburn_history: "never",
    family_history: "no",
    sun_exposure: "medium",
  });

  const [steps, setSteps] = useState<{ label: string; status: StepStatus }[]>(
    []
  );

  const handleImageSelect = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
    setGradcam(null);
    setRiskResult(null);
    setError(null);
    setSteps([]);
  }, []);

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    setPrediction(null);
    setGradcam(null);
    setRiskResult(null);
    setError(null);
    setSteps([]);
  }, [previewUrl]);

  const setStep = (
    idx: number,
    status: StepStatus,
    prev: { label: string; status: StepStatus }[]
  ) => {
    const next = [...prev];
    next[idx] = { ...next[idx], status };
    setSteps(next);
    return next;
  };

  const handleAnalyze = useCallback(async () => {
    if (!selectedImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setPrediction(null);
    setGradcam(null);
    setRiskResult(null);

    let currentSteps: { label: string; status: StepStatus }[] = [
      { label: "AI Image Prediction", status: "loading" },
      { label: "Grad-CAM Heatmap", status: "loading" },
      { label: "Intelligent Risk Score", status: "loading" },
    ];
    setSteps(currentSteps);

    let predResult: PredictionResult | null = null;
    try {
      predResult = await predictImage(selectedImage);
      setPrediction(predResult);
      currentSteps = setStep(0, "done", currentSteps);
    } catch {
      currentSteps = setStep(0, "error", currentSteps);
    }

    const [gradRes, riskRes] = await Promise.allSettled([
      getGradCam(selectedImage),
      calculateRisk(
        predResult?.prediction ?? "unknown",
        predResult?.confidence ?? 0.0,
        riskForm
      ),
    ]);

    if (gradRes.status === "fulfilled") {
      setGradcam(gradRes.value);
      currentSteps = setStep(1, "done", currentSteps);
    } else {
      currentSteps = setStep(1, "error", currentSteps);
    }

    if (riskRes.status === "fulfilled") {
      setRiskResult(riskRes.value);
      currentSteps = setStep(2, "done", currentSteps);
    } else {
      currentSteps = setStep(2, "error", currentSteps);
    }

    setIsAnalyzing(false);
  }, [selectedImage, riskForm]);

  const hasResults = prediction || gradcam || riskResult;

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-1.5 rounded-md hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="rounded-lg gradient-medical p-2">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-base font-bold text-foreground">AI Skin Cancer Detection</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Upload Skin Image</h2>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onClear={handleClear}
                selectedImage={selectedImage}
                previewUrl={previewUrl}
                disabled={isAnalyzing}
              />
            </div>
            <RiskCalculator formData={riskForm} onChange={setRiskForm} disabled={isAnalyzing} />
            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${!selectedImage || isAnalyzing
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "gradient-medical text-primary-foreground hover:opacity-90 shadow-card hover:shadow-elevated"
                }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Run Complete AI Analysis"
              )}
            </button>
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-5">
            {isAnalyzing && steps.length > 0 && <AnalysisProgress steps={steps} />}
            {!hasResults && !isAnalyzing && (
              <div className="rounded-lg border border-dashed border-border p-12 text-center h-full flex flex-col items-center justify-center bg-card/50">
                <Shield className="h-10 w-10 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Complete the profile and upload an image to generate AI-powered medical insights.
                </p>
              </div>
            )}
            {prediction && <ResultCard prediction={prediction.prediction} confidence={prediction.confidence} />}
            {gradcam && <HeatmapViewer originalUrl={previewUrl} heatmapUrl={gradcam.heatmap_url} />}
            {riskResult && <RiskResultCard data={riskResult} />}
            {prediction && (
              <ReportGenerator
                prediction={prediction.prediction}
                confidence={prediction.confidence}
                riskScore={riskResult?.risk_percentage ?? null}
                riskLevel={riskResult?.risk_level ?? null}
              />
            )}
            <Chatbot />
          </div>
        </div>
      </main>
      <footer className="mt-8 border-t border-border py-4">
        <p className="text-[10px] text-muted-foreground text-center uppercase tracking-tighter">
          Educational Demonstration Only • Neural Network ModelHAM10000 • Verified Clinical Logic
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
