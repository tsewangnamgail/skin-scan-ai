# ============================================================
# app/api/routes/heatmap.py
# ============================================================
from fastapi import APIRouter, UploadFile, File
from app.services.heatmap_service import generate_heatmap
from app.utils.image_processing import read_upload_image

router = APIRouter()


@router.post("/heatmap")
async def heatmap_endpoint(image: UploadFile = File(...)):
    image_bytes = await image.read()
    img_array = read_upload_image(image_bytes)
    result = generate_heatmap(img_array, image_bytes)
    return result