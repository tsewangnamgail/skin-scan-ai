import React, { useState } from "react";
import { FileText, Download, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { generateReport } from "@/utils/api";

interface ReportGeneratorProps {
  prediction: string | null;
  confidence: number | null;
  riskScore: number | null;
  riskLevel: string | null;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  prediction,
  confidence,
  riskScore,
  riskLevel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportText, setReportText] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const hasData = prediction && confidence !== null;

  const handleGenerate = async () => {
    if (!prediction || confidence === null) return;
    setLoading(true);
    setError(null);
    setReportText(null);
    try {
      const text = await generateReport({
        prediction,
        confidence,
        risk_score: riskScore ?? 0,
        risk_level: riskLevel ?? "Unknown",
      });
      setReportText(text);
      setExpanded(true);
    } catch {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!reportText) return;
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skin_cancer_report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!hasData) return null;

  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <div className="gradient-medical px-5 py-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary-foreground" />
        <h3 className="text-sm font-semibold text-primary-foreground uppercase tracking-wide">
          Medical Report
        </h3>
      </div>

      <div className="p-5 space-y-3">
        {/* Summary row */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Prediction</p>
            <p className="font-semibold text-foreground">{prediction}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Confidence</p>
            <p className="font-semibold text-foreground">
              {((confidence ?? 0) * 100).toFixed(1)}%
            </p>
          </div>
          {riskScore !== null && (
            <>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Risk Score</p>
                <p className="font-semibold text-foreground">{riskScore.toFixed(1)}/100</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Risk Level</p>
                <p className="font-semibold text-foreground capitalize">{riskLevel}</p>
              </div>
            </>
          )}
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        {/* AI Report text */}
        {reportText && (
          <div className="rounded-md border border-border bg-muted/40 overflow-hidden">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:bg-muted/60 transition-colors"
            >
              AI Report
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            {expanded && (
              <pre className="px-4 pb-4 text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto font-sans">
                {reportText}
              </pre>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          {!reportText && (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 gradient-medical text-primary-foreground font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate AI Report
                </>
              )}
            </button>
          )}

          {reportText && (
            <>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Regenerate"}
              </button>
              <button
                onClick={handleDownloadTxt}
                className="flex-1 flex items-center justify-center gap-2 gradient-medical text-primary-foreground font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                <Download className="h-4 w-4" />
                Download Report (.txt)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
