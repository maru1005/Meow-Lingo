# backend/app/schemas/chat.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# チャット送信
class ChatRequest(BaseModel):
    message: str
    # 今は使っていないなら残してもOK（将来用）
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str

# 会話履歴取得
class MessageSummary(BaseModel):
    role: str
    content: str


class ConversationSummary(BaseModel):
    conversation_id: str
    created_at: datetime
    messages: List[MessageSummary]