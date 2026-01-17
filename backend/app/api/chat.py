# backend/app/api/chat.py
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import logging

from app.schemas.chat import ChatRequest, ChatResponse, ConversationSummary, MessageSummary
from app.core.database import get_db
from app.services.chat_service import ChatService
from app.services.title_service import generate_ai_title
from app.dependencies.auth import get_current_user

# ロガーの設定
logger = logging.getLogger(__name__)

router = APIRouter()
chat_service = ChatService()

@router.get("/conversations", response_model=List[ConversationSummary])
def list_conversations(db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        # DBからデータを取得
        conversations = chat_service.list_conversations(db, user.firebase_uid)
        
        # V1のロジックに基づいた丁寧な詰め替え
        res = []
        for conv in conversations:
            res.append(
                ConversationSummary(
                    conversation_id=str(conv.conversation_uuid),
                    title=conv.title if conv.title else conv.updated_at.strftime("%Y-%m-%d %H:%M"),
                    updated_at=conv.updated_at,
                    mode=conv.chat_mode,
                    messages=[
                        MessageSummary(role=m.role, content=m.content)
                        for m in conv.messages
                    ]
                )
            )
        return res
    except Exception as e:
        logger.error(f"Error in list_conversations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversations/{conversation_id}", response_model=ConversationSummary)
def get_conversation(conversation_id: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        conv = chat_service.get_conversation_detail(db, conversation_id, user.firebase_uid)
        if not conv:
            raise HTTPException(status_code=404, detail="Not found")
        
        return ConversationSummary(
            conversation_id=str(conv.conversation_uuid),
            title=conv.title if conv.title else conv.updated_at.strftime("%Y-%m-%d %H:%M"),
            updated_at=conv.updated_at,
            mode=conv.chat_mode,
            messages=[
                MessageSummary(role=m.role, content=m.content)
                for m in conv.messages
            ]
        )
    except Exception as e:
        logger.error(f"Error in get_conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    try:
        # チャット実行
        result = await chat_service.chat(
            db=db,
            firebase_uid=user.firebase_uid,
            user_message=request.message,
            conversation_id=request.conversation_id,
            mode=request.mode
        )

        # タイトル生成（新規会話のみ）
        if not request.conversation_id:
            background_tasks.add_task(
                generate_ai_title,
                conversation_id=result["conversation_id"],
                user_message=request.message,
                user_id=user.id
            )
        
        return ChatResponse(
            reply=result["reply"],
            conversation_id=result["conversation_id"]
        )
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        if not chat_service.delete_conversation(db, conversation_id, user.firebase_uid):
            raise HTTPException(status_code=404, detail="Not found")
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Error in delete_conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))