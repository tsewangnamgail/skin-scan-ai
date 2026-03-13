# ============================================================
# app/api/routes/report.py
# ============================================================
from fastapi import APIRouter
from app.schemas.report_schema import ReportRequest, ReportResponse
from app.services.report_service import generate_report

router = APIRouter()


@router.post("/report", response_model=ReportResponse)
async def report_endpoint(request: ReportRequest):
    result = await generate_report(request.prediction, request.confidence, request.risk_level)
    return result