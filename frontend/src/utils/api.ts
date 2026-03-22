// ============================================================
// src/utils/api.ts — connects frontend to FastAPI backend
// ============================================================

const BASE_URL = "http://127.0.0.1:8000";

// ─── Types ───────────────────────────────────────────────────
export interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export interface GradCamResult {
  heatmap_url: string;
}

export interface RiskResult {
  risk_percentage: number;
  risk_level: string;       // "Low" | "Moderate" | "High"
  explanation: string;
}

export interface RiskFormData {
  age_group: string;
  skin_type: string;
  sunburn_history: string;
  family_history: string;
  sun_exposure: string;
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
    } catch { }
    throw new Error(detail);
  }
  return response.json();
}

// ─── API calls ───────────────────────────────────────────────

export async function predictImage(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<PredictionResult>(res);
}

export async function getGradCam(file: File): Promise<GradCamResult> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${BASE_URL}/heatmap`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<GradCamResult>(res);
}

/**
 * POST /risk
 * Sends prediction + confidence + clinical factors for intelligent assessment.
 */
export async function calculateRisk(
  prediction: string,
  confidence: number,
  formData: RiskFormData
): Promise<RiskResult> {
  const res = await fetch(`${BASE_URL}/risk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      prediction, 
      confidence,
      ...formData
    }),
  });
  return handleResponse<RiskResult>(res);
}

export async function generateReport(data: {
  prediction: string;
  confidence: number;
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

export async function sendChatMessage(message: string): Promise<{ response: string }> {
  const res = await fetch(`${BASE_URL}/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: message }),
  });
  return handleResponse<{ response: string }>(res);
}

export async function checkHealth(): Promise<{ status: string; message: string }> {
  const res = await fetch(`${BASE_URL}/health`);
  return handleResponse<{ status: string; message: string }>(res);
}
