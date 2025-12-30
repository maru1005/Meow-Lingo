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

async def get_ai_response(
        user_input: str, 
        dictionary_data: dict = None,
        messages_history: list | None = None,
        searchkeyword: str | None = None,
        ) -> str:
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

    # 3. 過去会話履歴をセット
    # AIが文脈を理解できるように履歴を追加
    if messages_history:
        for msg in messages_history:
            # SQLAlchemyのモデルオブジェクトを想定（roleとcontent属性を持つ）
            messages.append({
                "role": msg.role, 
                "content": msg.content
            })

    # 4. 辞書データがある場合、情報を追加
    if dictionary_data:
        dict_str = json.dumps(dictionary_data, ensure_ascii=False, indent=2)
        # 履歴の直後、ユーザーの質問の直前に「最新の参考知識」として配置
        messages.append({
            "role": "system", 
            "content": f"### 【最優先参照データ】\n以下の辞書データは最新かつ正確な情報です。あなたの知識よりもこの内容を優先して回答してください:\n{dict_str}"
        })

    # 5. 今回のユーザーの質問を追加
    messages.append({"role": "user", "content": user_input})

    # --- デバッグ: AIに送る全メッセージを確認（開発中に便利） ---
    print(f"--- DEBUG: Total messages sent to AI: {len(messages)} ---")

    try:
        # 6. OpenAI API呼び出し
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7 #温度パラメータで応答の多様性を調整
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
        result = await get_ai_response(
            user_input=test_input, 
            dictionary_data=test_dict,
            messages_history=None,
            searchkeyword=None
            )
        print(f"\n質問: {test_input}")
        print("-" * 30)
        print(result)

    asyncio.run(test())
