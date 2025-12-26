# backend/app/services/llm_service.py

import os
import asyncio
from openai import AsyncOpenAI  # これだけをインポートする

# クライアントの初期化
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# prompt 読み込み
def load_prompt(filename):
    current_dir = os.path.dirname(__file__)
    path = os.path.join(current_dir, "..", "prompts", filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

# AI応答 重要　
# 
async def get_ai_response(user_input: str, dictionary_data: dict = None):
    base_prompt = load_prompt("system_prompt.txt")

    rag_context = ""
    if dictionary_data:
        rag_context = f"\n\n【最優先参照データー】\n回答には以下の辞書データを必ず参照してください:\n{dictionary_data.get('definition', '')}\n{dictioinary_data}\n"
    
    # prompt 合体
    full_system_prompt = f"""
{base_prompt}
{rag_context}

【質問タイプ別詳細ルール】
- vocabulary: {load_prompt("vocabulary.txt")}
- grammar: {load_prompt("grammar.txt")}
- example: {load_prompt("example.txt")}
- learning_advice: {load_prompt("learning_advice.txt")}
- fallback: {load_prompt("fallback.txt")}
"""

    try:
        # client userの質問に対してAI応答を取得
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": full_system_prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=0.3 # 温度パラメータの設定 RAG嘘つき対策　低め設定
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"エラーが発生しました: {str(e)}"

# テスト用コード
if __name__ == "__main__":
    async def test():
        print("AIに質問中... (最新版ライブラリ使用)")
        test_input = "appleのニュアンスを教えて"
        result = await get_ai_response(test_input)
        print(f"\n質問: {test_input}")
        print("-" * 30)
        print(result)

    asyncio.run(test())