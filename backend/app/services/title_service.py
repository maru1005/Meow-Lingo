# backend/app/services/title_service.py
import logging

# ロガーの設定（
logger = logging.getLogger(__name__)

async def generate_ai_title(user_message: str) -> str:
    """
    LLMを呼び出して、会話の内容に合わせた絵文字付きタイトルを生成する。
    LLMの実装がまだでも、一旦モックで動くようにしておく。
    """
    try:
        # 1. プロンプトの組み立て
        # 💡 ここで「どんな学習内容か」をAIに判定させるのがリーダーのこだわり！
        prompt = f"""
        ユーザーの以下の発言内容を分析し、最適な絵文字1つと、5文字以内のタイトルを生成してください。
        
        【ルール】
        - 挨拶なら 🐱
        - 旅行なら ✈️
        - 食べ物・注文なら 🍔
        - 仕事・ビジネスなら 💼
        - その他は内容に合った絵文字を選択
        
        【ユーザーの発言内容】
        {user_message}
        
        【出力例】
        🐱 英語で挨拶
        """

        # 2. LLM呼び出し（ここはチームのLLM基盤ができたら入れ替えるニャ！）
        # 現時点では、特定のキーワードに反応する「超速・疑似AI」を仕込んでおく
        title = "🐱 英語の練習" # デフォルト
        
        msg = user_message.lower()
        if any(w in msg for w in ["hello", "hi", "nice to"]):
            title = "🐱 英語で挨拶"
        elif any(w in msg for w in ["airport", "travel", "hotel"]):
            title = "✈️ 旅行の英語"
        elif any(w in msg for w in ["eat", "food", "order", "restaurant"]):
            title = "🍔 注文の練習"
        elif any(w in msg for w in ["work", "business", "meeting"]):
            title = "💼 お仕事英語"

        # 💡 本物のLLMを呼ぶ準備ができたら、ここで await call_llm(prompt) する
        
        return title

    except Exception as e:
        logger.error(f"タイトル生成中にエラーが発生したけど、止まらないようにするニャ: {e}")
        return "🐱 新しい会話"

async def update_conversation_title_in_db(conversation_id: str, title: str):
    """
    DBのタイトルを更新する関数。Firebase設定ができたらここを実装！
    """
    # TODO: db.collection("conversations").document(conversation_id).update({"title": title})
    print(f"DEBUG: DBの会話({conversation_id})のタイトルを「{title}」に更新する予約をしたニャ！")