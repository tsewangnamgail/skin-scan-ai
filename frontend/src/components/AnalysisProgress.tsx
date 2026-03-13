import React from "react";
import { Check, Loader2 } from "lucide-react";

interface Step {
  label: string;
  status: "pending" | "loading" | "done" | "error";
}

interface AnalysisProgressProps {
  steps: Step[];
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ steps }) => {
  return (
    <div className="rounded-lg border border-border bg-card shadow-card p-5 space-y-3">
      <p className="text-sm font-semibold text-foreground">
        AI analyzing your dermoscopic image...
      </p>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          {step.status === "done" ? (
            <Check className="h-4 w-4 text-success shrink-0" />
          ) : step.status === "loading" ? (
            <Loader2 className="h-4 w-4 text-accent animate-spin shrink-0" />
          ) : step.status === "error" ? (
            <span className="h-4 w-4 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
              <span className="text-destructive text-xs font-bold">!</span>
            </span>
          ) : (
            <span className="h-4 w-4 rounded-full border border-border shrink-0" />
          )}
          <span
            className={`text-sm ${
              step.status === "done"
                ? "text-foreground"
                : step.status === "loading"
                ? "text-foreground font-medium"
                : step.status === "error"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {step.label}
            {step.status === "done" && " ✓"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AnalysisProgress;
