# ============================================================
# app/utils/helpers.py
# ============================================================
import time
from functools import wraps
from app.core.logger import logger


def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        logger.info(f"{func.__name__} executed in {end - start:.4f} seconds")
        return result
    return wrapper


def validate_image_format(filename: str) -> bool:
    allowed_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in allowed_extensions


def format_percentage(value: float) -> str:
    return f"{value * 100:.2f}%"