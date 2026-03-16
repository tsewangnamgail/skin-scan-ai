# ============================================================
# app/schemas/risk_schema.py
# ============================================================
from pydantic import BaseModel


class RiskRequest(BaseModel):
    """Request body for risk assessment.

    melanoma_probability is the model's predicted probability for the melanoma class
    (value in [0, 1]). If not provided, the API will do a best-effort fallback using
    prediction / confidence, but providing melanoma_probability is strongly
    recommended for accurate risk scoring.
    """

    prediction: str
    confidence: float
    melanoma_probability: float | None = None


class RiskResponse(BaseModel):
    risk_score: float
    risk_level: str
    recommendation: str