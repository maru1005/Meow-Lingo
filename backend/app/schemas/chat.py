# backend/app/schemas/chat.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- メッセージの最小単位 ---
class MessageSummary(BaseModel):
    role: str
    content: str
    created_at: Optional[datetime] = None

    # SQLAlchemyのモデルをそのままPydanticに変換するための設定
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
    
    model_config = {"from_attributes": True}

# --- 会話履歴の一覧・詳細用 ---
class ConversationSummary(BaseModel):
    # DBでは conversation_uuid 、フロント conversation_id 
    conversation_id: str = Field(..., alias="conversation_uuid") 
    title: Optional[str] = None
    updated_at: datetime
    mode: str = "study"
    messages: List[MessageSummary] 

    model_config = {
        "from_attributes": True,   # DBモデルからの変換許可
        "populate_by_name": True   # alias(conversation_id)でのデータ投入を許可
    }