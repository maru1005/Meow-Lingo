# backend/app/services/title_service.py
import logging
from app.core.database import SessionLocal
from app.services.llm_service import get_ai_response
from app.crud import chat as chat_crud

logger = logging.getLogger(__name__)

async def generate_ai_title(conversation_id: str, user_message: str, user_id: int):
    """
    バックグラウンドで会話のタイトルを生成してDBを更新するニャ！
    """
    if user_message == "INITIAL_GREETING":
        return

    try:
        prompt = f"""
        Analyze the following user input and provide:
        1. One representative emoji.
        2. A title within 10 characters in Japanese.
        Format: "Emoji Title" (e.g., "🐱 挨拶の練習")
        Content: {user_message}
        """

        ai_title = await get_ai_response(user_input=prompt, chat_mode="system_prompt")
        ai_title = ai_title.strip().replace('"', '')

        # バックグラウンドタスクなので自分でセッションを管理するニャ
        db = SessionLocal()
        try:
            conv = chat_crud.get_conversation(db, conversation_id, user_id)
            if conv:
                conv.title = ai_title
                db.commit()
                logger.info(f"Title updated: {ai_title}")
        finally:
            db.close()

    except Exception as e:
        logger.error(f"Failed to generate title: {e}")