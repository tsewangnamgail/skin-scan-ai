import React, { useState, useCallback } from "react";
import { Loader2, Calculator } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import RiskCalculator from "@/components/RiskCalculator";
import RiskResultCard from "@/components/RiskResultCard";
import { calculateRisk, type RiskFormData, type RiskResult } from "@/utils/api";

const RiskPage: React.FC = () => {
  const [formData, setFormData] = useState<RiskFormData>({
    age: "",
    skinType: "",
    sunburns: "",
    familyHistory: "",
    sunExposure: "",
  });
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass form data — api.ts will derive a neutral prediction for the backend
      const res = await calculateRisk(formData);
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
          <div className="rounded-lg gradient-medical p-2.5">
            <Calculator className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Risk Calculator</h1>
            <p className="text-sm text-muted-foreground">Personalized skin cancer risk assessment based on clinical factors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <RiskCalculator formData={formData} onChange={setFormData} disabled={loading} />
            <button
              onClick={handleCalculate}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${loading
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "gradient-medical text-primary-foreground hover:opacity-90 shadow-card"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Risk"
              )}
            </button>
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <div>
            {result ? (
              <RiskResultCard data={result} />
            ) : (
              <div className="rounded-lg border border-dashed border-border p-12 text-center h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Fill in the form and click <span className="font-semibold text-foreground">Calculate Risk</span> to see your assessment.
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
