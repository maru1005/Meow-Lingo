# backend/app/services/title_service.py
import logging
from app.core.database import SessionLocal
from app.services.llm_service import get_internal_json
from app.crud import chat as chat_crud

logger = logging.getLogger(__name__)


async def generate_ai_title(conversation_id: str, user_message: str, user_id: int):
    """
    バックグラウンドで会話のタイトルを生成してDBを更新します。
    """
    if user_message == "INITIAL_GREETING":
        return

    try:
        system_prompt = (
            "You are a title generator. Return ONLY valid JSON. "
            "Rules: title is Japanese and <= 10 characters. emoji is exactly 1 emoji. "
            "No persona, no suffix, no explanation."
        )

        data = await get_internal_json(
            system_prompt=system_prompt,
            user_input=f"Content: {user_message}",
            temperature=0.2,
            default={"emoji": "🐱", "title": "会話"},
        )
        emoji = data.get("emoji")
        title = data.get("title")
        if not isinstance(emoji, str) or not emoji.strip():
            emoji = "🐱"
        if not isinstance(title, str) or not title.strip():
            title = "会話"
        emoji = emoji.strip().split()[0]
        title = title.strip().replace('"', "").replace("'", "")
        if len(title) > 10:
            title = title[:10]
        ai_title = f"{emoji} {title}"

        # バックグラウンドタスクなので自分でセッションを管理する
        db = SessionLocal()
        try:
            conv = chat_crud.get_conversation(db, conversation_id, user_id)
            if conv:
                conv.title = ai_title
                db.commit()
                logger.info(f"Title updated: {ai_title}")
        finally:
            db.close()

        return ai_title

    except Exception as e:
        logger.error(f"Failed to generate title: {e}")
        return None