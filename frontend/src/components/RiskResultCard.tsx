import React from "react";
import { Activity, AlertTriangle, CheckCircle, Info } from "lucide-react";
import type { RiskResult } from "@/utils/api";

interface RiskResultCardProps {
  data: RiskResult;
}

const RiskResultCard: React.FC<RiskResultCardProps> = ({ data }) => {
  const gaugePercent = Math.min(data.risk_score, 100);

  const level = data.risk_level.toLowerCase();

  const levelConfig = {
    high: {
      color: "text-red-500",
      bar: "bg-red-500",
      badge: "bg-red-500/10 text-red-500 border-red-500/30",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    },
    medium: {
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
          Risk Assessment
        </h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Score gauge */}
        <div className="text-center">
          <p className="text-4xl font-bold text-foreground">
            {data.risk_score.toFixed(1)}
            <span className="text-lg text-muted-foreground font-normal"> / 100</span>
          </p>

          <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border text-sm font-semibold ${config.badge}`}>
            {config.icon}
            {data.risk_level.charAt(0).toUpperCase() + data.risk_level.slice(1)} Risk
          </div>

          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mt-4">
            <div
              className={`h-full rounded-full transition-all duration-700 ${config.bar}`}
              style={{ width: `${gaugePercent}%` }}
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-md border border-border bg-muted/40 p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Recommendation
          </p>
          <p className="text-sm text-foreground leading-relaxed">{data.recommendation}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskResultCard;
