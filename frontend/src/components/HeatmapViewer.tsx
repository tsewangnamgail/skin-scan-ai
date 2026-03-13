import React from "react";
import { Eye } from "lucide-react";

interface HeatmapViewerProps {
  originalUrl: string | null;
  heatmapUrl: string | null;
}

const HeatmapViewer: React.FC<HeatmapViewerProps> = ({
  originalUrl,
  heatmapUrl,
}) => {
  if (!heatmapUrl || !originalUrl) return null;

  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <div className="gradient-medical px-5 py-3 flex items-center gap-2">
        <Eye className="h-4 w-4 text-primary-foreground" />
        <h3 className="text-sm font-semibold text-primary-foreground uppercase tracking-wide">
          Grad-CAM Heatmap
        </h3>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Original Image
            </p>
            <div className="aspect-square rounded-md border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
              <img
                src={originalUrl}
                alt="Original"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              AI Heatmap
            </p>
            <div className="aspect-square rounded-md border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
              <img
                src={
                  heatmapUrl.startsWith("data:")
                    ? heatmapUrl
                    : `data:image/png;base64,${heatmapUrl}`
                }
                alt="Grad-CAM Heatmap"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Red/yellow regions indicate areas the AI focused on for its
          prediction.
        </p>
      </div>
    </div>
  );
};

export default HeatmapViewer;
