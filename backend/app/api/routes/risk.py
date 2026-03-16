# ============================================================
# app/api/routes/risk.py
# ============================================================
from fastapi import APIRouter, HTTPException
from app.schemas.risk_schema import RiskRequest, RiskResponse
from app.services.risk_service import assess_risk

router = APIRouter()


@router.post("/risk", response_model=RiskResponse)
async def risk_endpoint(request: RiskRequest) -> RiskResponse:
    try:
        result = assess_risk(
            prediction=request.prediction,
            confidence=request.confidence,
            melanoma_probability=request.melanoma_probability,
        )
        return RiskResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e