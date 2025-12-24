# backend/app/api/chat.py
# LLM APIエンドポイントを定義
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm_service import get_ai_response

router = APIRouter()

# フロントエンドから送られてくるデータの形を定義
class ChatRequest(BaseModel):
    message: str
    # 今後、辞書データなどを追加したい場合はここにフィールドを増やす

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """e
    ユーザーからのメッセージを受け取り、AIコーチの回答を返します。
    """
    try:
        # llm_service.py で作った関数を呼び出す
        answer = await get_ai_response(request.message)
        return {"answer": answer}
    except Exception as e:
        # 万が一エラーが起きた場合に、フロントに500エラーを返す
        raise HTTPException(status_code=500, detail=str(e))