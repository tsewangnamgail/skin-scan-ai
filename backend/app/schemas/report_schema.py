# ============================================================
# app/schemas/report_schema.py
# ============================================================
from pydantic import BaseModel


class ReportRequest(BaseModel):
    prediction: str
    confidence: float
    risk_level: str


class ReportResponse(BaseModel):
    report: str