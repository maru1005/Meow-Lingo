import logging
from app.services.chat_service import ChatService
from app.core.database import SessionLocal
from app.services.llm_service import get_ai_response # チームが作ったLLMサービスを使うニャ

logger = logging.getLogger(__name__)

async def generate_ai_title(conversation_id: str, user_message: str, user_id: int):
    """
    LLMを呼び出してタイトルを生成し、PostgreSQLに保存する。
    """
    try:
        # 1. プロンプトの組み立て
        prompt = f"""
        以下のユーザーの発言内容を分析し、最適な絵文字1つと、5文字以内のタイトルを1つだけ出力してください。余計な解説は不要です。
        
        【ルール】
        - 挨拶なら 🐱, 旅行なら ✈️, 食べ物なら 🍔, 仕事なら 💼
        - 内容：{user_message}
        """

        # 2. LLM呼び出し（チームが作ったサービスを拝借！）
        ai_title = await get_ai_response(user_input=prompt)
        ai_title = ai_title.strip()[:10]  # 長すぎないようにカット

        # 3. DB（PostgreSQL）に保存
        db = SessionLocal()
        try:
            service = ChatService()
            # さっき作った update_title メソッドでDBを更新するニャ！
            service.update_title(db=db, conversation_id=conversation_id, user_id=user_id, title=ai_title)
            print(f"DEBUG: 会話 {conversation_id} のタイトルを「{ai_title}」に更新したニャ！")
        finally:
            db.close()

    except Exception as e:
        logger.error(f"タイトル生成中にエラーが発生したけど、メインのチャットは止めないニャ: {e}")