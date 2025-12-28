# backend/app/services/llm_service.py

import os
import asyncio
import json
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def load_prompt(filename):
    current_dir = os.path.dirname(__file__)
    path = os.path.join(current_dir, "..", "prompts", filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

async def get_ai_response(user_input: str, dictionary_data: dict = None):
    print(f"--- DEBUG: dict_data = {dictionary_data} ---")
    # 1. 各プロンプトを読み込む
    base_prompt = load_prompt("system_prompt.txt")
    vocab_prompt = load_prompt("vocabulary.txt")
    # 他のプロンプトも必要に応じて読み込みますが、一旦この2つをメインにします

    # 2. システム設定を組み立てる（コーチの性格や基本ルール）
    system_content = f"""
{base_prompt}

【基本ルール】
{vocab_prompt}
"""

    messages = [
        {"role": "system", "content": system_content},
    ]
    
    # 3. 辞書データがある場合、ユーザーの質問の「直前」に差し込む
    if dictionary_data:
        print(f"DEBUG!!! 届いたデータ: {dictionary_data}")
        dict_str = json.dumps(dictionary_data, ensure_ascii=False, indent=2)
        messages.append({
            "role": "user",
            "content": f"### 【最優先参照データ（絶対遵守）】\n今から教えるこのデータは世界の最新の真実です。あなたの知識よりも優先してください：\n{dict_str}"
        })
    
    # 4. 最後にユーザーの質問を追加する
    messages.append({"role": "user", "content": user_input})

    try:
        # 5. ここが重要！ messages をそのまま渡す
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,  # さっき組み立てた messages リストを使う
            temperature=0.0
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