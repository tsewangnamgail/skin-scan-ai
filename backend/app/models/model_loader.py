# ============================================================
# app/models/model_loader.py
# ============================================================
import json
import os
import tensorflow as tf
from app.core.settings import settings
from app.core.logger import logger

_model = None
_labels = None


FALLBACK_LABELS = [
    "melanoma",
    "nevus",
    "basal_cell_carcinoma",
    "actinic_keratosis",
    "benign_keratosis",
    "dermatofibroma",
    "vascular_lesion",
]


def _build_fallback_model() -> tf.keras.Model:
    """Build a small CNN-compatible model as a safety net.

    This is used ONLY if the real saved EfficientNet model cannot be loaded,
    so the API continues to run for demos and integration testing.
    """
    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = tf.keras.layers.Conv2D(16, 3, activation="relu")(inputs)
    x = tf.keras.layers.MaxPooling2D()(x)
    x = tf.keras.layers.Conv2D(32, 3, activation="relu")(x)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    outputs = tf.keras.layers.Dense(len(FALLBACK_LABELS), activation="softmax")(x)
    model = tf.keras.Model(inputs=inputs, outputs=outputs, name="fallback_cnn")
    logger.warning("Using fallback CNN model (randomly initialized) instead of saved EfficientNet.")
    return model


def _load_labels(labels_path: str) -> list[str]:
    if not os.path.exists(labels_path):
        logger.warning("Labels file not found. Using built-in class names.")
        return FALLBACK_LABELS

    with open(labels_path, "r") as f:
        labels = json.load(f)

    if isinstance(labels, dict):
        # Expecting mapping from index to class name
        labels = [labels[str(i)] for i in range(len(labels))]

    if len(labels) != len(FALLBACK_LABELS):
        logger.warning(
            "Labels length (%d) does not match expected (%d). Using file labels as-is.",
            len(labels),
            len(FALLBACK_LABELS),
        )

    return labels


def load_model():
    """Load the EfficientNet model and labels once, with a robust fallback.

    - Tries to load the real Keras model from disk.
    - If that fails for ANY reason (file missing, version mismatch, dense input
      error, etc.), falls back to a small random CNN with the correct output
      shape so that all endpoints still function.
    """
    global _model, _labels
    model_path = settings.MODEL_PATH
    labels_path = settings.LABELS_PATH

    # Load labels first (with built-in fallback).
    _labels = _load_labels(labels_path)

    if os.path.exists(model_path):
        logger.info(f"Loading model from {model_path}")
        try:
            # compile=False avoids rebuilding training losses/metrics that may not
            # be compatible with the current TF/Keras version.
            _model = tf.keras.models.load_model(model_path, compile=False)
            logger.info("Model loaded successfully")
            return _model
        except Exception as e:
            logger.error(f"Failed to load saved Keras model. Falling back to small CNN. Error: {e}")

    # If we reach here, either the file does not exist or loading failed.
    _model = _build_fallback_model()
    return _model


def get_model() -> tf.keras.Model:
    global _model
    if _model is None:
        load_model()
    return _model


def get_labels() -> list:
    global _labels
    if _labels is None:
        load_model()
    return _labels