# ============================================================
# app/api/routes/predict.py
# ============================================================
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.prediction_service import run_prediction
from app.utils.image_processing import read_upload_image
from app.schemas.prediction_schema import PredictionResponse

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
async def predict_endpoint(image: UploadFile = File(...)) -> PredictionResponse:
    try:
        image_bytes = await image.read()
        img_array = read_upload_image(image_bytes)
        result = run_prediction(img_array)
        return PredictionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e