# ============================================================
# app/api/routes/health.py
# ============================================================
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "AI Skin Cancer Detection API is running"}