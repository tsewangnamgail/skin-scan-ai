# ============================================================
# app/schemas/prediction_schema.py
# ============================================================
from pydantic import BaseModel
from typing import Dict


class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: Dict[str, float]