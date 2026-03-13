# ============================================================
# app/rag/groq_client.py
# ============================================================
from langchain_groq import ChatGroq
from app.core.settings import settings
from app.core.logger import logger

_llm = None


def get_groq_llm():
    global _llm
    if _llm is None:
        logger.info("Initializing Groq LLM...")
        _llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name=settings.GROQ_MODEL,
            temperature=0.3,
            max_tokens=2048,
        )
        logger.info("Groq LLM initialized successfully")
    return _llm