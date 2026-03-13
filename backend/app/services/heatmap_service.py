# ============================================================
# app/services/heatmap_service.py
# ============================================================
import numpy as np
from app.utils.gradcam import compute_gradcam
from app.utils.image_processing import overlay_heatmap_on_image, encode_image_to_base64


def generate_heatmap(img_array: np.ndarray, original_image_bytes: bytes) -> dict:
    heatmap = compute_gradcam(img_array)
    overlay = overlay_heatmap_on_image(original_image_bytes, heatmap)
    base64_image = encode_image_to_base64(overlay)
    return {"heatmap_url": f"data:image/png;base64,{base64_image}"}