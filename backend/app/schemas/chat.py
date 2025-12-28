# backend/app/schemas/chat.py
from pydantic import BaseModel
from typing import Optional, Any # Any 柔軟な型指定のためにインポート

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    
    dictionary_data: Optional[dict[str, Any]] = None 

class ChatResponse(BaseModel):
    reply: str
    conversation_id: str

class ConversationSummary(BaseModel):
    conversation_id: str
    title: str