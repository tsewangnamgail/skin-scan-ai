import React, { useState, useCallback } from "react";
import { Loader2, Calculator } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import RiskCalculator from "@/components/RiskCalculator";
import RiskResultCard from "@/components/RiskResultCard";
import { calculateRisk, type RiskFormData, type RiskResult } from "@/utils/api";

const RiskPage: React.FC = () => {
  const [formData, setFormData] = useState<RiskFormData>({
    age_group: "young adult",
    skin_type: "Medium",
    sunburn_history: "never",
    family_history: "no",
    sun_exposure: "medium",
  });
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Demographic-only path — pass neutral placeholder classification
      const res = await calculateRisk("unknown", 0.0, formData);
      setResult(res);
    } catch {
      setError("Risk calculation failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg gradient-medical p-2.5 shadow-md">
            <Calculator className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clinical Risk Profile</h1>
            <p className="text-sm text-muted-foreground">Weighted skin cancer risk assessment based on personal and medical history.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <RiskCalculator formData={formData} onChange={setFormData} disabled={loading} />
            <button
              onClick={handleCalculate}
              disabled={loading}
              className={`w-full py-3.5 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-card ${loading
                  ? "bg-muted text-muted-foreground cursor-not-allowed border-none"
                  : "gradient-medical text-primary-foreground hover:opacity-90 shadow-elevated"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing Risk Profile...
                </>
              ) : (
                "Compute Personalized Risk Score"
              )}
            </button>
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}
          </div>

          <div>
            {result ? (
              <RiskResultCard data={result} />
            ) : (
              <div className="rounded-lg border border-dashed border-border p-12 text-center h-full flex flex-col items-center justify-center bg-card/50">
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Fill in the profile factors and click <span className="font-bold text-foreground">Compute Score</span> to generate a medical-evidence based risk profile.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RiskPage;
