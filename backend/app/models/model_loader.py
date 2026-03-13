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


def load_model():
    global _model, _labels
    model_path = settings.MODEL_PATH
    labels_path = settings.LABELS_PATH

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    if not os.path.exists(labels_path):
        raise FileNotFoundError(f"Labels file not found: {labels_path}")

    logger.info(f"Loading model from {model_path}")
    _model = tf.keras.models.load_model(model_path)
    logger.info("Model loaded successfully")

    with open(labels_path, "r") as f:
        _labels = json.load(f)

    if isinstance(_labels, dict):
        _labels = [_labels[str(i)] for i in range(len(_labels))]

    logger.info(f"Labels loaded: {_labels}")
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