# ============================================================
# app/rag/vector_store.py
# ============================================================
import os
from langchain_community.vectorstores import Chroma
from app.rag.document_loader import load_documents
from app.rag.text_splitter import split_documents
from app.rag.embedding_model import get_embedding_model
from app.core.settings import settings
from app.core.logger import logger

_vector_store = None


def initialize_vector_store():
    global _vector_store

    embedding_model = get_embedding_model()
    persist_dir = settings.CHROMA_PERSIST_DIR

    if os.path.exists(persist_dir) and os.listdir(persist_dir):
        logger.info("Loading existing vector store from disk...")
        _vector_store = Chroma(
            persist_directory=persist_dir,
            embedding_function=embedding_model,
            collection_name="skin_cancer_knowledge",
        )
        logger.info("Vector store loaded from disk.")
        return _vector_store

    documents = load_documents()
    if not documents:
        logger.warning("No documents found. Creating empty vector store.")
        _vector_store = Chroma(
            persist_directory=persist_dir,
            embedding_function=embedding_model,
            collection_name="skin_cancer_knowledge",
        )
        return _vector_store

    chunks = split_documents(documents)
    logger.info(f"Creating vector store with {len(chunks)} chunks...")

    _vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory=persist_dir,
        collection_name="skin_cancer_knowledge",
    )

    logger.info("Vector store created and persisted.")
    return _vector_store


def get_vector_store():
    global _vector_store
    if _vector_store is None:
        initialize_vector_store()
    return _vector_store