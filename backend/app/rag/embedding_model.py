# ============================================================
# app/rag/embedding_model.py
# ============================================================
from langchain_community.embeddings import HuggingFaceEmbeddings
from app.core.settings import settings
from app.core.logger import logger

_embedding_model = None


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL}")
        _embedding_model = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
        logger.info("Embedding model loaded successfully")
    return _embedding_model