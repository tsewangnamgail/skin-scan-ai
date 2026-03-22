import asyncio
import re
from app.core.logger import logger
from app.rag.retriever import get_retriever
from app.rag.groq_client import get_groq_llm
from app.core.settings import settings

async def chat_with_rag(question: str) -> dict:
    """Return a knowledge-based answer using direct RAG (Retrieval-Augmented Generation)."""
    try:
        # 1. Retrieve relevant documents
        retriever = get_retriever(k=4)
        docs = await asyncio.to_thread(retriever.invoke, question)
        
        context = "\n\n".join([doc.page_content for doc in docs])
        
        # 2. Prepare the prompt for the LLM
        prompt = f"""You are a helpful medical AI assistant specializing in dermatology and skin cancer.
Use the following pieces of retrieved context to answer the user's question.
If the context doesn't contain the answer, use your internal knowledge.

IMPORTANT: 
- Do NOT use markdown bolding (no ** text **). Use plain text for emphasis if needed.
- Do NOT include any medical disclaimer in your response.
- Provide a direct and concise answer.

Context:
{context}

Question: {question}

Answer:"""

        # 3. Call the LLM
        llm = get_groq_llm()
        result = await asyncio.to_thread(llm.invoke, prompt)
        
        # result.content contains the response for ChatGroq
        response_text = result.content
        
        return {"response": response_text}
    except Exception as e:
        logger.error(f"Chatbot error: {e}", exc_info=True)
        return {
            "response": (
                "I encountered an internal error while processing your question. "
                "Please try again or consult a dermatologist for medical advice."
            )
        }