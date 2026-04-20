# ============================================================
# app/core/settings.py
# ============================================================
import os
from pydantic_settings import BaseSettings

# Base directory for the backend (skin-scan-ai/backend)
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Skin Cancer Detection System"
    API_VERSION: str = "v1"
    DEBUG: bool = True

    MODEL_PATH: str = os.path.join(BACKEND_DIR, "model", "efficientnet_ham10000.keras")
    LABELS_PATH: str = os.path.join(BACKEND_DIR, "model", "labels.json")

    KNOWLEDGE_DIR: str = os.path.join(BACKEND_DIR, "knowledge", "books")
    CHROMA_PERSIST_DIR: str = os.path.join(BACKEND_DIR, "chroma_db")

    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.1-8b-instant"

    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    class Config:
        env_file = os.path.join(BACKEND_DIR, ".env")
        env_file_encoding = "utf-8"
        extra = "allow"


settings = Settings()