# ============================================================
# app/services/rag_chat_service.py
# ============================================================
from app.rag.agent import get_rag_agent
from app.core.logger import logger


async def chat_with_rag(question: str) -> dict:
    try:
        agent = get_rag_agent()
        response = agent.invoke({"input": question})

        if isinstance(response, dict) and "output" in response:
            answer = response["output"]
        elif isinstance(response, str):
            answer = response
        else:
            answer = str(response)

        return {"response": answer}
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return {
            "response": f"I apologize, but I encountered an error processing your question. Please try again. Error: {str(e)}"
        }