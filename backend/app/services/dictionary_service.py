# backend/app/services/dictionary_service.py 
# 外部辞書APIから単語の意味を取得し、AIが理解しやすい形式に整形

import httpx
from typing import Optional, Dict, Any

DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/"

async def fetch_dictionary_data(word: str) -> Optional[Dict[str, Any]]:
    """外部辞書APIからデータを取得して、AIが読みやすい形に整形するニャ"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{DICTIONARY_API_URL}{word}", timeout=5.0)
            
            if response.status_code != 200:
                return None
                
            data = response.json()
            raw_data = data[0] if isinstance(data, list) else data
            
            # AIに必要な情報だけを抽出（トークン節約と精度向上ニャ！）
            filtered_data = {
                "word": raw_data.get("word"),
                "phonetic": raw_data.get("phonetic"),
                "meanings": []
            }
            
            for meaning in raw_data.get("meanings", [])[:2]:  # 主要な2つに絞るニャ
                m_item = {
                    "partOfSpeech": meaning.get("partOfSpeech"),
                    "definition": meaning.get("definitions")[0].get("definition") if meaning.get("definitions") else ""
                }
                example = meaning.get("definitions")[0].get("example")
                if example:
                    m_item["example"] = example
                filtered_data["meanings"].append(m_item)
                
            return filtered_data
            
    except Exception as e:
        return None