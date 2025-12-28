# backend/app/api/v1/endpoints/chat.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.chat import ChatRequest, ChatResponse, ConversationSummary
from app.core.database import get_db
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat")

# ChatServiceをインスタンス化
chat_service = ChatService()

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # 【採用！】チームのChatServiceを呼び出す（この中で辞書取得もLLM呼び出しも行われます）
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
def reset_chat():
    return {"conversation_id": "new-dummy-conversation-id"}

@router.get("/conversation", response_model=list[ConversationSummary])
def list_conversation():
    return []