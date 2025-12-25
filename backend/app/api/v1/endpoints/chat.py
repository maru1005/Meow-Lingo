# backend/app/api/v1/endpoints/chat.py
from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse, ConversationSummary
from app.services.llm_service import get_ai_response # LLMサービスからAIの回答を取得する関数をインポート

router = APIRouter()

@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):

    try:
        # 1. servicesロジックでAIの回答を取得
        ai_answer = await get_ai_response(request.message)
        
        # 2. バックエンド担当が決めた「ChatResponse」の形に合わせて返す
        return ChatResponse(
            reply=ai_answer, # バック担当の変数名に合わせて reply に入れる
            conversation_id=request.conversation_id or "session-001",
        )
    except Exception as e:
        # エラーが起きた場合は適切に報告
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reset")
def reset_chat():
    return {"conversation_id": "new-dummy-conversation-id"}

@router.get("/conversation", response_model=list[ConversationSummary])
def list_conversation():
    return []
