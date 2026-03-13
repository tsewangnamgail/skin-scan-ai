// ============================================================
// src/utils/api.ts — connects frontend to FastAPI backend
// Base URL: http://127.0.0.1:8000  (proxied via Vite /api → backend)
// ============================================================

const BASE_URL = "http://127.0.0.1:8000";

// ─── Types ───────────────────────────────────────────────────
export interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export interface GradCamResult {
  heatmap_url: string; // data:image/png;base64,...
}

export interface RiskResult {
  risk_score: number;
  risk_level: string;       // "low" | "medium" | "high"
  recommendation: string;
}

export interface RiskFormData {
  age: string;
  skinType: string;
  sunburns: string;
  familyHistory: string;
  sunExposure: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Helpers ─────────────────────────────────────────────────
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = `Server error (${response.status}).`;
    try {
      const body = await response.json();
      if (body?.detail) detail = body.detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }
  return response.json();
}

// ─── API calls ───────────────────────────────────────────────

/**
 * POST /predict
 * Sends a skin image and returns the AI prediction.
 */
export async function predictImage(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("image", file);   // backend param name is `image`
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<PredictionResult>(res);
}

/**
 * POST /heatmap
 * Sends a skin image and returns a base64 Grad-CAM overlay.
 */
export async function getGradCam(file: File): Promise<GradCamResult> {
  const formData = new FormData();
  formData.append("image", file);   // backend param name is `image`
  const res = await fetch(`${BASE_URL}/heatmap`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<GradCamResult>(res);
}

/**
 * POST /risk
 * Sends prediction + confidence and returns risk assessment.
 * Falls back to a local calculation when called from RiskPage/Dashboard
 * where only demographic data is available (no prior prediction).
 */
export async function calculateRisk(
  predictionOrForm: string | RiskFormData,
  confidence?: number
): Promise<RiskResult> {
  // If called with a full RiskFormData object (from RiskPage / Dashboard),
  // derive sensible defaults for the backend's required fields.
  let prediction: string;
  let conf: number;

  if (typeof predictionOrForm === "string") {
    prediction = predictionOrForm;
    conf = confidence ?? 0.5;
  } else {
    // Demographic-only path — we don't have a classification yet.
    // Send a neutral placeholder so the backend can still compute a score.
    prediction = "unknown";
    conf = 0.5;
  }

  const res = await fetch(`${BASE_URL}/risk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prediction, confidence: conf }),
  });
  return handleResponse<RiskResult>(res);
}

/**
 * POST /report
 * Sends prediction / confidence / risk_level and returns an AI text report.
 */
export async function generateReport(data: {
  prediction: string;
  confidence: number;
  risk_score: number;
  risk_level: string;
}): Promise<string> {
  const res = await fetch(`${BASE_URL}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prediction: data.prediction,
      confidence: data.confidence,
      risk_level: data.risk_level,
    }),
  });
  const json = await handleResponse<{ report: string }>(res);
  return json.report;
}

/**
 * POST /chatbot
 * Sends a user question and returns the AI chatbot response.
 */
export async function sendChatMessage(message: string): Promise<{ response: string }> {
  const res = await fetch(`${BASE_URL}/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: message }),  // backend field is `question`
  });
  return handleResponse<{ response: string }>(res);
}

/**
 * GET /health
 * Simple liveness check.
 */
export async function checkHealth(): Promise<{ status: string; message: string }> {
  const res = await fetch(`${BASE_URL}/health`);
  return handleResponse<{ status: string; message: string }>(res);
}
