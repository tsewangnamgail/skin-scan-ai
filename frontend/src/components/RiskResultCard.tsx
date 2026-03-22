import React from "react";
import { Activity, AlertTriangle, CheckCircle, Info } from "lucide-react";
import type { RiskResult } from "@/utils/api";

interface RiskResultCardProps {
  data: RiskResult;
}

const RiskResultCard: React.FC<RiskResultCardProps> = ({ data }) => {
  // Use percentage (1-25 range as per AI instructions)
  const score = data.risk_percentage;
  // Normalize for the gauge (if max is 25, 25 = 100%)
  const gaugePercent = Math.min((score / 25) * 100, 100);

  const level = data.risk_level.toLowerCase();

  const levelConfig = {
    high: {
      color: "text-red-500",
      bar: "bg-red-500",
      badge: "bg-red-500/10 text-red-500 border-red-500/30",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    },
    moderate: {
      color: "text-amber-500",
      bar: "bg-amber-500",
      badge: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      icon: <Info className="h-5 w-5 text-amber-500" />,
    },
    low: {
      color: "text-emerald-500",
      bar: "bg-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    },
  };

  const config = levelConfig[level as keyof typeof levelConfig] ?? levelConfig.low;

  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <div className="gradient-medical px-5 py-3 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary-foreground" />
        <h3 className="text-sm font-semibold text-primary-foreground uppercase tracking-wide">
          Intelligence-Derived Risk Profile
        </h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Score gauge */}
        <div className="text-center">
          <p className="text-5xl font-bold text-foreground">
             {score.toFixed(1)}%
          </p>

          <div className={`inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full border text-sm font-bold shadow-sm ${config.badge}`}>
            {config.icon}
            {data.risk_level} Risk
          </div>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden mt-6">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${config.bar}`}
              style={{ width: `${gaugePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1 uppercase font-medium">
            <span>Low (1%)</span>
            <span>Max (25%)</span>
          </div>
        </div>

        {/* Clinical Explanation */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 shadow-inner">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            AI Reasoning Highlights
          </p>
          <p className="text-sm text-foreground leading-relaxed italic">
            "{data.explanation}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskResultCard;
