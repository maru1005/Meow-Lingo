# backend/app/services/dictionary_service.py 
# 外部辞書APIから単語の意味を取得し、AIが理解しやすい形式に整形

import httpx
from typing import Optional, Dict, Any

DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/"

async def fetch_dictionary_data(word: str) -> Optional[Dict[str, Any]]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{DICTIONARY_API_URL}{word}", timeout=5.0)
            
            if response.status_code == 200:
                data = response.json()
                raw_data = data[0] if isinstance(data, list) else data
                
                
                # AIが理解しやすいように、必要な情報だけを整理して抽出
                filtered_data = {
                    "word": raw_data.get("word"), # 単語
                    "phonetic": raw_data.get("phonetic"), # 発音記号
                    "meanings": [] # 意味のリスト
                }
                
                # 意味（品詞、定義、例文）を最大3つ程度に絞る
                for meaning in raw_data.get("meanings", [])[:3]:
                    m_item = { # m_item = meaning item 1つ分
                        "partOfSpeech": meaning.get("partOfSpeech"), # 品詞か動詞か
                        "definition": meaning.get("definitions")[0].get("definition") if meaning.get("definitions") else "" # 定義　一番目を取得
                    }
                    # 例文があれば追加
                    example = meaning.get("definitions")[0].get("example")
                    if example:
                        m_item["example"] = example
                        
                    filtered_data["meanings"].append(m_item)
                
                return filtered_data
                
            return None
            
    except Exception as e:
        print(f"Dictionary API Error: {e}")
        return None