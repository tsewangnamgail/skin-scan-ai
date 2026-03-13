# ============================================================
# app/models/inference.py
# ============================================================
import numpy as np
from app.models.model_loader import get_model
from app.utils.image_processing import preprocess_image


def predict(img_array: np.ndarray) -> np.ndarray:
    """
    Runs the CNN model on a preprocessed image array.
    """
    model = get_model()
    preprocessed_img = preprocess_image(img_array)
    probabilities = model.predict(preprocessed_img)
    return probabilities