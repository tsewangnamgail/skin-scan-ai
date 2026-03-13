# ============================================================
# app/schemas/risk_schema.py
# ============================================================
from pydantic import BaseModel


class RiskRequest(BaseModel):
    prediction: str
    confidence: float


class RiskResponse(BaseModel):
    risk_score: float
    risk_level: str
    recommendation: str