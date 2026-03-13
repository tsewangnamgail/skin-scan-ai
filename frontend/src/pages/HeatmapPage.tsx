import React, { useState, useCallback } from "react";
import { Loader2, Eye } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ImageUpload from "@/components/ImageUpload";
import HeatmapViewer from "@/components/HeatmapViewer";
import { getGradCam, type GradCamResult } from "@/utils/api";

const HeatmapPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gradcam, setGradcam] = useState<GradCamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setGradcam(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    setGradcam(null);
    setError(null);
  }, [previewUrl]);

  const handleGenerate = useCallback(async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getGradCam(selectedImage);
      setGradcam(result);
    } catch {
      setError("Failed to generate heatmap. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedImage]);

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg gradient-medical p-2.5">
            <Eye className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Grad-CAM Heatmap</h1>
            <p className="text-sm text-muted-foreground">Explainable AI — see which regions influenced the prediction</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="max-w-md">
            <ImageUpload
              onImageSelect={handleImageSelect}
              onClear={handleClear}
              selectedImage={selectedImage}
              previewUrl={previewUrl}
              disabled={loading}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={!selectedImage || loading}
            className={`py-3 px-8 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              !selectedImage || loading
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "gradient-medical text-primary-foreground hover:opacity-90 shadow-card"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Heatmap...
              </>
            ) : (
              "Generate Heatmap"
            )}
          </button>
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        {gradcam ? (
          <HeatmapViewer originalUrl={previewUrl} heatmapUrl={gradcam.heatmap_url} />
        ) : (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Upload an image and click <span className="font-semibold text-foreground">Generate Heatmap</span> to visualize AI attention regions.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default HeatmapPage;
