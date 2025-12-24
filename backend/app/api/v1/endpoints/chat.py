from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse, ConversationSummary

router = APIRouter(prefix="/chat")

@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):
    return ChatResponse(
        reply="これはダミー応答です",
        conversation_id=request.conversation_id or "dummy-conversation-id",
    )

@router.post("/reset")
def reset_chat():
    return {
        "conversation_id": "new-dummy-conversation-id"
    }

@router.get("/conversation", response_model=list[ConversationSummary])
def list_conversation():
    return[]
