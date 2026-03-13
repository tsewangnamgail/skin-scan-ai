# ============================================================
# app/utils/image_processing.py
# ============================================================
import io
import base64
import numpy as np
import cv2
from PIL import Image
import tensorflow as tf


def read_upload_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes))
    image = image.convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image)
    return img_array


def preprocess_image(img_array: np.ndarray) -> np.ndarray:
    img = img_array.copy().astype(np.float32)
    img = np.expand_dims(img, axis=0)
    img = tf.keras.applications.efficientnet.preprocess_input(img)
    return img


def overlay_heatmap_on_image(
    original_image_bytes: bytes, heatmap: np.ndarray
) -> np.ndarray:
    image = Image.open(io.BytesIO(original_image_bytes))
    image = image.convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image)

    heatmap_resized = cv2.resize(heatmap, (224, 224))
    heatmap_normalized = np.uint8(255 * heatmap_resized)
    heatmap_colored = cv2.applyColorMap(heatmap_normalized, cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

    overlay = cv2.addWeighted(img_array, 0.6, heatmap_colored, 0.4, 0)
    return overlay


def encode_image_to_base64(image_array: np.ndarray) -> str:
    image = Image.fromarray(image_array.astype(np.uint8))
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    base64_string = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return base64_string