# ============================================================
# app/models/inference.py
# ============================================================
import numpy as np
import tensorflow as tf
from app.models.model_loader import get_model
from app.utils.image_processing import preprocess_image


def predict(img_array: np.ndarray) -> np.ndarray:
    """
    Runs the CNN model on a preprocessed image array.
    """
    model = get_model()

    # Step 1: Resize + basic preprocessing (your existing function)
    img = preprocess_image(img_array)  # expected shape (1, 224, 224, 3)

    # Step 2: EfficientNet preprocessing (VERY IMPORTANT)
    img = tf.keras.applications.efficientnet.preprocess_input(img)

    # Step 3: Predict
    probabilities = model.predict(img)

    return probabilities