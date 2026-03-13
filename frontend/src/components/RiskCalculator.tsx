import React from "react";
import { Calculator } from "lucide-react";
import type { RiskFormData } from "@/utils/api";

interface RiskCalculatorProps {
  formData: RiskFormData;
  onChange: (data: RiskFormData) => void;
  disabled?: boolean;
}

const selectClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";

const RiskCalculator: React.FC<RiskCalculatorProps> = ({
  formData,
  onChange,
  disabled,
}) => {
  const update = (key: keyof RiskFormData, value: string) =>
    onChange({ ...formData, [key]: value });

  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Calculator className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-semibold text-foreground">
          Risk Calculator
        </h3>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Age Group
          </label>
          <select
            className={selectClass}
            value={formData.age}
            onChange={(e) => update("age", e.target.value)}
            disabled={disabled}
          >
            <option value="">Select</option>
            <option value="under30">Under 30</option>
            <option value="30-50">30–50</option>
            <option value="over50">Over 50</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Skin Type
          </label>
          <select
            className={selectClass}
            value={formData.skinType}
            onChange={(e) => update("skinType", e.target.value)}
            disabled={disabled}
          >
            <option value="">Select</option>
            <option value="fair">Fair / Burns easily</option>
            <option value="medium">Medium</option>
            <option value="dark">Dark / Rarely burns</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Sunburn History
          </label>
          <select
            className={selectClass}
            value={formData.sunburns}
            onChange={(e) => update("sunburns", e.target.value)}
            disabled={disabled}
          >
            <option value="">Select</option>
            <option value="none">None</option>
            <option value="few">1–5 times</option>
            <option value="many">More than 5</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Family History
          </label>
          <select
            className={selectClass}
            value={formData.familyHistory}
            onChange={(e) => update("familyHistory", e.target.value)}
            disabled={disabled}
          >
            <option value="">Select</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Sun Exposure (hrs/day)
          </label>
          <select
            className={selectClass}
            value={formData.sunExposure}
            onChange={(e) => update("sunExposure", e.target.value)}
            disabled={disabled}
          >
            <option value="">Select</option>
            <option value="low">Less than 1 hr</option>
            <option value="moderate">1–3 hrs</option>
            <option value="high">More than 3 hrs</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;
