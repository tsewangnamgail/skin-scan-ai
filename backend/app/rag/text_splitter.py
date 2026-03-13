# ============================================================
# app/rag/text_splitter.py
# ============================================================
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.logger import logger


def split_documents(documents: list, chunk_size: int = 1000, chunk_overlap: int = 200) -> list:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks = text_splitter.split_documents(documents)
    logger.info(f"Split into {len(chunks)} chunks")
    return chunks