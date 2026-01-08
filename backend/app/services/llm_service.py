# backend/app/services/llm_service.py
import os
import asyncio
import json
import logging
from openai import AsyncOpenAI
from .prompt_manager import prompt_manager # 昨日のマネージャーを活用！

# 💡 ログの設定：これがあれば「何が起きたか」が魔法みたいにわかるニャ！
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OpenAIクライアントの初期化
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def get_ai_response(
        user_input: str, 
        dictionary_data: dict = None,
        messages_history: list | None = None,
        searchkeyword: str | None = None,
        ) -> str:
    """
    AI応答を生成する。
    """
    
    # 1. PromptManagerを使ってプロンプトを読み込む
    # 💡 昨日の努力（PromptManager）を使ってファイルを読み込むニャ。エラー処理もあっちでやってるからスッキリ！
    base_prompt = prompt_manager.get_prompt("system_prompt.txt")
    
    full_system_prompt = f"""
{base_prompt}

【質問タイプ別詳細ルール】
- vocabulary: {prompt_manager.get_prompt("vocabulary.txt")}
- grammar: {prompt_manager.get_prompt("grammar.txt")}
- example: {prompt_manager.get_prompt("example.txt")}
- learning_advice: {prompt_manager.get_prompt("learning_advice.txt")}
- fallback: {prompt_manager.get_prompt("fallback.txt")}
"""

    # 2. メッセージリストの初期化
    messages = [{"role": "system", "content": full_system_prompt}]

    # 3. 過去会話履歴をセット
    if messages_history:
        for msg in messages_history:
            messages.append({"role": msg.role, "content": msg.content})

    # 4. 辞書データがある場合、情報を追加
    if dictionary_data:
        dict_str = json.dumps(dictionary_data, ensure_ascii=False, indent=2)
        messages.append({
            "role": "system", 
            "content": f"### 【最優先参照データ】\n以下の辞書データは最新かつ正確な情報です。あなたの知識よりもこの内容を優先して回答してください:\n{dict_str}"
        })

    # 5. 今回のユーザーの質問を追加
    messages.append({"role": "user", "content": user_input})

    # --- 💡 ログ出力：ここが今日学んだ「良いこと」の結晶だニャ！ ---
    logger.info(f"🚀 [LLM Request] User Input: '{user_input[:20]}...' (Total messages: {len(messages)})")
    if dictionary_data:
        logger.info(f"📖 Dictionary data attached for: {dictionary_data.get('word', 'unknown')}")

    try:
        # 6. OpenAI API呼び出し
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7
        )
        
        ai_content = response.choices[0].message.content
        logger.info("✅ [LLM Response] Success! AI gave us an answer.")
        return ai_content

    except Exception as e:
        # 💡 エラーログも詳しく残せば、後でリーダーを助けてくれるニャ
        logger.error(f"❌ [LLM Error] Something went wrong: {str(e)}", exc_info=True)
        return f"申し訳ありません。AI応答中にエラーが発生しました: {str(e)}"

# テスト用コード（省略なし）
if __name__ == "__main__":
    # ... (テストコードはそのまま)
    pass