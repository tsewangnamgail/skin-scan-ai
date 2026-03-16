# ============================================================
# app/api/routes/report.py
# ============================================================
from fastapi import APIRouter, HTTPException
from app.schemas.report_schema import ReportRequest, ReportResponse
from app.services.report_service import generate_report

router = APIRouter()


@router.post("/report", response_model=ReportResponse)
async def report_endpoint(request: ReportRequest) -> ReportResponse:
    try:
        predicted_class = request.predicted_class or request.prediction or "unknown"
        result = generate_report(
            predicted_class=predicted_class,
            confidence=request.confidence,
            risk_level=request.risk_level,
            risk_score=request.risk_score,
        )
        return ReportResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e