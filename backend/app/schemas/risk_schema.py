# ============================================================
# app/schemas/risk_schema.py
# ============================================================
from pydantic import BaseModel


class RiskRequest(BaseModel):
    """Request body for intelligent risk assessment."""
    prediction: str
    confidence: float
    melanoma_probability: float | None = None
    
    # Flexible clinical factors
    age_group: str | None = None
    skin_type: str | None = None
    sunburn_history: str | None = None
    family_history: str | None = None
    sun_exposure: str | None = None


class RiskResponse(BaseModel):
    risk_percentage: float
    risk_level: str
    explanation: str | None = None