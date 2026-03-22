import React from "react";
import { Calculator } from "lucide-react";
import type { RiskFormData } from "@/utils/api";

interface RiskCalculatorProps {
  formData: RiskFormData;
  onChange: (data: RiskFormData) => void;
  disabled?: boolean;
}

const selectClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-colors hover:border-accent";

const RiskCalculator: React.FC<RiskCalculatorProps> = ({
  formData,
  onChange,
  disabled,
}) => {
  const update = (key: keyof RiskFormData, value: string) =>
    onChange({ ...formData, [key]: value });

  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <div className="gradient-medical px-4 py-3 border-b border-border flex items-center gap-2">
        <Calculator className="h-4 w-4 text-primary-foreground" />
        <h3 className="text-sm font-semibold text-primary-foreground uppercase tracking-wide">
          Risk Factors Profile
        </h3>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Age Group
          </label>
          <select
            className={selectClass}
            value={formData.age_group}
            onChange={(e) => update("age_group", e.target.value)}
            disabled={disabled}
          >
            <option value="under 18">Child (Under 18)</option>
            <option value="young adult">Young Adult (18-35)</option>
            <option value="adult">Adult (35-65)</option>
            <option value="elderly">Elderly (65+)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Skin Sensitivity (Fitzpatrick)
          </label>
          <select
            className={selectClass}
            value={formData.skin_type}
            onChange={(e) => update("skin_type", e.target.value)}
            disabled={disabled}
          >
            <option value="Type 1">Type I (Very fair, always burns)</option>
            <option value="Fair">Fair (Often burns)</option>
            <option value="Medium">Medium (Tans gradually)</option>
            <option value="Dark">Dark (Rarely burns)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            History of Sunburns
          </label>
          <select
            className={selectClass}
            value={formData.sunburn_history}
            onChange={(e) => update("sunburn_history", e.target.value)}
            disabled={disabled}
          >
            <option value="never">Never or Rarely</option>
            <option value="sometimes">Sometimes (1-2 times/year)</option>
            <option value="often">Often (Frequent history)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Family History of Skin Cancer
          </label>
          <select
            className={selectClass}
            value={formData.family_history}
            onChange={(e) => update("family_history", e.target.value)}
            disabled={disabled}
          >
            <option value="no">No family history</option>
            <option value="yes">Yes (Genetic history)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Daily UV Exposure
          </label>
          <select
            className={selectClass}
            value={formData.sun_exposure}
            onChange={(e) => update("sun_exposure", e.target.value)}
            disabled={disabled}
          >
            <option value="low">Low (Mostly indoors)</option>
            <option value="medium">Moderate (Commuting/Walks)</option>
            <option value="5+ hours">High (5+ hours outdoors)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;
