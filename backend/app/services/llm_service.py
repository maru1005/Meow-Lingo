# backend/app/services/llm_service.py
# LLMサービス：OpenAI APIを使用してAI応答を生成 
# 辞書データを最優先知識として組み込む機能付き
import os
import asyncio
import json
from openai import AsyncOpenAI

# OpenAIクライアントの初期化
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def load_prompt(filename):
    """プロンプトファイルを読み込む補助関数"""
    current_dir = os.path.dirname(__file__)
    path = os.path.join(current_dir, "..", "prompts", filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

async def get_ai_response(user_input: str, dictionary_data: dict = None):
    """
    AI応答を生成する。
    辞書データがある場合は、それを最優先知識としてプロンプトに組み込む。
    """
    # 1. すべてのプロンプトファイルを読み込んでシステムプロンプトを構築
    try:
        base_prompt = load_prompt("system_prompt.txt")
        full_system_prompt = f"""
{base_prompt}

【質問タイプ別詳細ルール】
- vocabulary: {load_prompt("vocabulary.txt")}
- grammar: {load_prompt("grammar.txt")}
- example: {load_prompt("example.txt")}
- learning_advice: {load_prompt("learning_advice.txt")}
- fallback: {load_prompt("fallback.txt")}
"""
    except Exception as e:
        print(f"Prompt Load Error: {e}")
        full_system_prompt = "あなたは優秀な英語学習コーチです。"

    # 2. メッセージリストの初期化
    messages = [
        {"role": "system", "content": full_system_prompt}
    ]

    # 3. 辞書データがある場合、最優先データとして追加
    if dictionary_data:
        # デバッグ用ログ（Dockerターミナルで見れます）
        print(f"--- DEBUG: dictionary_data provided for '{user_input}' ---")
        
        dict_str = json.dumps(dictionary_data, ensure_ascii=False, indent=2)
        messages.append({
            "role": "system", # システム命令として「このデータを使え」と指示
            "content": f"### 【最優先参照データ】\n以下の辞書データは最新かつ正確な情報です。あなたの知識よりもこの内容を優先して回答してください:\n{dict_str}"
        })

    # 4. ユーザーの質問を追加
    messages.append({"role": "user", "content": user_input})

    try:
        # 5. OpenAI API呼び出し
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7 # 少し人間味のある回答にするため0.7に設定
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return f"申し訳ありません。AI応答中にエラーが発生しました: {str(e)}"

# テスト用コード（python backend/app/services/llm_service.py で実行可能）
if __name__ == "__main__":
    async def test():
        print("AIにテスト質問中...")
        test_input = "apple"
        # テスト用に偽の辞書データを入れる
        test_dict = {"word": "apple", "meanings": [{"partOfSpeech": "noun", "definition": "A round fruit with red or green skin."}]}
        result = await get_ai_response(test_input, test_dict)
        print(f"\n質問: {test_input}")
        print("-" * 30)
        print(result)

    asyncio.run(test())
