# ============================================================
# app/api/routes/risk.py
# ============================================================
from fastapi import APIRouter
from app.schemas.risk_schema import RiskRequest, RiskResponse
from app.services.risk_service import assess_risk

router = APIRouter()


@router.post("/risk", response_model=RiskResponse)
async def risk_endpoint(request: RiskRequest):
    result = assess_risk(request.prediction, request.confidence)
    return result