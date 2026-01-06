# backend/app/api/v1/endpoints/chat.py
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from app.schemas.chat import ChatRequest, ChatResponse, ConversationSummary, MessageSummary
from app.core.database import get_db
from app.services.chat_service import ChatService
from app.services.title_service import generate_ai_title
from app.dependencies.auth import get_current_user
from app.core.logger import get_logger

router = APIRouter(prefix="/chat")
logger = get_logger(__name__)

# ChatServiceをインスタンス化
chat_service = ChatService()

@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    uid = current_user.firebase_uid

    logger.info(
        "Post /api/chat called uid=%s",
        uid,
    )

    try:
        logger.debug(
            "chat start uid=%s conversation_id=%s",
            uid,
            request.conversation_id,
        )
        # ChatServiceを呼び出す
        result = await chat_service.chat(
            db=db,
            firebase_uid=current_user.firebase_uid,
            user_message=request.message,
            conversation_id=request.conversation_id  # スペル修正済み
        )

        # 新規会話（IDがなかった時）だけタイトル生成を予約
        if not request.conversation_id:
            background_tasks.add_task(
                generate_ai_title,
                result["conversation_id"],
                request.message
            )
            logger.debug(
                "title generation scheduled uid=%s conversation_id=%s",
                uid,
                result["conversation_id"],
            )
        
        logger.debug(
            "chat success uid=%s conversation_id=%s",
            uid,
            result["conversation_id"],
        )
        
        return ChatResponse(
            reply=result["reply"],
            conversation_id=result["conversation_id"],
        )
        
    except Exception:
        logger.exception(
            "chat failed uid=%s",
            uid,
        )
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/reset")
def reset_chat(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    uid = current_user.firebase_uid

    logger.info(
        "POST /api/chat/reset called uid=%s",
        uid,
    )

    try:
        conversation = chat_service.reset_conversation(
            db=db,
            firebase_uid=current_user.firebase_uid,
        )

        logger.debug(
            "chat reset success uid=%s conversation_id=%s",
            uid,
            conversation.conversation_uuid,
            uid,
        )

        return {"conversation_id": str(conversation.conversation_uuid)}
    
    except Exception:
        logger.exception(
            "chat reset failed uid=%s",
            uid,
        )
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/conversations", response_model=List[ConversationSummary])
def list_conversation(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    uid = current_user.firebase_uid

    logger.info(
        "GET /api/chat/conversations called uid=%s",
        uid,
    )

    try:
        # 履歴一覧を取得
        conversations = chat_service.list_conversations(
            db=db,
            firebase_uid=current_user.firebase_uid,
        )

        logger.debug(
            "conversations fetched uid=%s count=%s",
            uid,
            len(conversations),
        )

        # スキーマへの詰め替え（updated_at 対応）
        return [
            ConversationSummary(
                conversation_id=str(conv.conversation_uuid),
                title=conv.title if conv.title else conv.updated_at.strftime("%Y-%m-%d %H:%M"),
                updated_at=conv.updated_at,  # 学習順に並べるためのこだわり
                messages=[
                    MessageSummary(role=m.role, content=m.content)
                    for m in conv.messages
                ]
            )
            for conv in conversations
        ]
    
    except Exception:
        logger.exception(
            "fetch conversations failed uid=%s",
            uid,
        )
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/conversations/{conversation_id}", response_model=ConversationSummary)
def get_conversation_detail(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    uid = current_user.firebase_uid

    logger.info(
        "GET /api/chat/conversations/{id} called uid=%s conversation_id=%s",
        uid,
        conversation_id
    )
    # 指定された会話の詳細を取得
    conversation = chat_service.get_conversation_detail(
        db=db,
        conversation_id=conversation_id,
        firebase_uid=current_user.firebase_uid
    )

    if not conversation:
        logger.warning(
            "conversation not found uid=%s conversation_id=%s",
            uid,
            conversation_id,
        )
        raise HTTPException(status_code=404, detail="Conversation not found")

    # 1件分の詰め替え
    return ConversationSummary(
        conversation_id=str(conversation.conversation_uuid),
        title=conversation.title if conversation.title else conversation.updated_at.strftime("%Y-%m-%d %H:%M"),
        updated_at=conversation.updated_at,
        messages=[
            MessageSummary(role=m.role, content=m.content)
            for m in conversation.messages
        ]
    )