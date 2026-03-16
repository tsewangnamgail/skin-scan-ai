# ============================================================
# app/schemas/chatbot_schema.py
# ============================================================
from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    # Use 'response' to match older frontend expectations.
    response: str