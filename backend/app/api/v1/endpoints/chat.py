# backend/app/api/v1/endpoints/chat.py
# チャットエンドポイント　
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.chat import ChatRequest, ChatResponse, ConversationSummary, MessageSummary
from app.core.database import get_db
from app.services.chat_service import ChatService
from app.dependencies.auth import get_current_user


router = APIRouter(prefix="/chat")

# ChatServiceをインスタンス化
chat_service = ChatService()

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # ChatServiceを呼び出す（この中で辞書取得もLLM呼び出しも行われる）
        result = await chat_service.chat(
            db=db,
            firebase_uid="test-user-123", # 将来的に認証から取得
            user_message=request.message,
            email=None,
            language="en"
        )
        
        # サービスから返ってきた結果をフロントに返す
        return ChatResponse(
            reply=result["reply"],
            conversation_id=result["conversation_id"],
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reset")
def reset_chat(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    conversation = chat_service.reset_conversation(
        db=db,
        firebase_uid=current_user.firebase_uid,
    )
    return {"conversation_id": str(conversation.conversation_uuid)}

@router.get("/conversations", response_model=list[ConversationSummary])
def list_conversation(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    conversations =  chat_service.list_conversations(
        db=db,
        firebase_uid=current_user.firebase_uid,
    )

    # ★ ここがconversations を Schema に「詰め替え」
    return [
        ConversationSummary(
            conversation_id=str(conversation.conversation_uuid),
            created_at=conversation.created_at,
            messages=[
                MessageSummary(
                    role=message.role,
                    content=message.content,
                )
                for message in conversation.messages
            ],
        )
        for conversation in conversations
    ]