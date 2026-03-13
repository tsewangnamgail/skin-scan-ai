# ============================================================
# app/api/routes/chatbot.py
# ============================================================
from fastapi import APIRouter
from app.schemas.chatbot_schema import ChatRequest, ChatResponse
from app.services.rag_chat_service import chat_with_rag

router = APIRouter()


@router.post("/chatbot", response_model=ChatResponse)
async def chatbot_endpoint(request: ChatRequest):
    result = await chat_with_rag(request.question)
    return result