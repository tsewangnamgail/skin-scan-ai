# ============================================================
# app/schemas/report_schema.py
# ============================================================
from pydantic import BaseModel


class ReportRequest(BaseModel):
    # Support both old and new field names from the frontend.
    prediction: str | None = None
    predicted_class: str | None = None
    confidence: float
    risk_level: str
    risk_score: float | None = None


class ReportResponse(BaseModel):
    predicted_class: str
    confidence: float
    risk_level: str
    risk_score: float | None = None
    explanation: str
    recommended_action: str
    disclaimer: str
    # For backward compatibility with any UI expecting a single text field.
    report: str