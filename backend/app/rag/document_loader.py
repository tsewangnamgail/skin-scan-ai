# ============================================================
# app/rag/document_loader.py
# ============================================================
import os
from langchain_community.document_loaders import PyPDFLoader
from app.core.settings import settings
from app.core.logger import logger


def load_documents() -> list:
    knowledge_dir = settings.KNOWLEDGE_DIR
    documents = []

    if not os.path.exists(knowledge_dir):
        logger.warning(f"Knowledge directory not found: {knowledge_dir}")
        return documents

    for filename in os.listdir(knowledge_dir):
        if filename.endswith(".pdf"):
            filepath = os.path.join(knowledge_dir, filename)
            logger.info(f"Loading document: {filepath}")
            try:
                loader = PyPDFLoader(filepath)
                docs = loader.load()
                documents.extend(docs)
                logger.info(f"Loaded {len(docs)} pages from {filename}")
            except Exception as e:
                logger.error(f"Error loading {filename}: {e}")

    logger.info(f"Total documents loaded: {len(documents)}")
    return documents