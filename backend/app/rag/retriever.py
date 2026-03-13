# ============================================================
# app/rag/retriever.py
# ============================================================
from app.rag.vector_store import get_vector_store
from app.core.logger import logger


def get_retriever(k: int = 4):
    vector_store = get_vector_store()
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k},
    )
    logger.info(f"Retriever created with k={k}")
    return retriever