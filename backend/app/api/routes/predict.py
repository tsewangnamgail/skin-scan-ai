# ============================================================
# app/api/routes/predict.py
# ============================================================
from fastapi import APIRouter, UploadFile, File
from app.services.prediction_service import run_prediction
from app.utils.image_processing import read_upload_image

router = APIRouter()


@router.post("/predict")
async def predict_endpoint(image: UploadFile = File(...)):
    image_bytes = await image.read()
    img_array = read_upload_image(image_bytes)
    result = run_prediction(img_array)
    return result