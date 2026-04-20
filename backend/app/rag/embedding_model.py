# ============================================================
# app/rag/embedding_model.py
# ============================================================
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from app.core.settings import settings
from app.core.logger import logger

_embedding_model = None


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        logger.info("Loading lightweight FastEmbed model")
        _embedding_model = FastEmbedEmbeddings(
            model_name="BAAI/bge-small-en-v1.5",
            cache_dir="/tmp/fastembed_cache"
        )
        logger.info("FastEmbed model loaded successfully")
    return _embedding_model