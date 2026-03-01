# backend/app/schemas/chat.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- メッセージの最小単位 ---
class MessageSummary(BaseModel):
    role: str
    content: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

# --- フロントからのチャットリクエスト ---
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    mode: str = "study"

# --- チャットの返答 ---
class ChatResponse(BaseModel):
    reply: str
    conversation_id: Optional[str] = None
    title: Optional[str] = None

    model_config = {"from_attributes": True}

# --- 会話履歴の一覧・詳細用 ---
class ConversationSummary(BaseModel):
    conversation_id: str
    title: Optional[str] = None
    updated_at: datetime
    mode: str = "study"
    messages: List[MessageSummary]

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }