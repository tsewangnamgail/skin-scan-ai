# ============================================================
# app/api/routes/chatbot.py
# ============================================================
from fastapi import APIRouter, HTTPException
from app.schemas.chatbot_schema import ChatRequest, ChatResponse
from app.services.rag_chat_service import chat_with_rag

router = APIRouter()


@router.post("/chatbot", response_model=ChatResponse)
async def chatbot_endpoint(request: ChatRequest) -> ChatResponse:
    try:
        result = await chat_with_rag(request.question)
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e