# backend/app/api/v1/endpoints/chat.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.chat import ChatRequest, ChatResponse, ConversationSummary
from app.core.database import get_db  # DBセッション取得用
from app.services.chat_service import ChatService # さっき作ったサービス

router = APIRouter(prefix="/chat")

# ChatServiceをインスタンス化
chat_service = ChatService()

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # chat_service の chat メソッドを呼び出す
        # 本来はFirebaseからuidを取りますが、一旦テスト用に固定かrequestから取る形を想定
        result = await chat_service.chat(
            db=db,
            firebase_uid="test-user-123", # ログイン機能ができたらここを動的にします
            user_message=request.message,
            email=None,
            language="en"
        )
        
        # 2. サービスから返ってきた結果（reply）をレスポンスに込めて返す
        return ChatResponse(
            reply=result["reply"],
            conversation_id=result["conversation_id"],
        )
        
    except Exception as e:
        # エラーログを出力しつつ、500エラーを返す
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 以下の reset や conversation は一旦そのまま（または必要に応じてサービス側へ移行）
@router.post("/reset")
def reset_chat():
    return {"conversation_id": "new-dummy-conversation-id"}

@router.get("/conversation", response_model=list[ConversationSummary])
def list_conversation():
    return []