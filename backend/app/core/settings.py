# ============================================================
# app/core/settings.py
# ============================================================
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Skin Cancer Detection System"
    API_VERSION: str = "v1"
    DEBUG: bool = True

    MODEL_PATH: str = os.path.join("model", "efficientnet_ham10000.keras")
    LABELS_PATH: str = os.path.join("model", "labels.json")

    KNOWLEDGE_DIR: str = os.path.join("knowledge", "books")
    CHROMA_PERSIST_DIR: str = os.path.join("chroma_db")

    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "mixtral-8x7b-32768"

    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"


settings = Settings()