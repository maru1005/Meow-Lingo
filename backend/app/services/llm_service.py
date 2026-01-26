# backend/app/services/llm_service.py
import os
import json
import logging
import re
from openai import AsyncOpenAI
from .prompt_manager import prompt_manager

logger = logging.getLogger(__name__)

class LLMService:
    _client = None
    
    def __init__(self):
        # APIクライアントをシングルトン化
        if LLMService._client is None:
            LLMService._client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.client = LLMService._client

    async def get_ai_response(self, *, user_input: str, chat_mode: str = "study", 
                             dictionary_data: dict = None, messages_history: list = None) -> str:
        
        # メッセージ構築（リスト内包表記で効率化）
        messages = [{"role": "system", "content": prompt_manager.get_prompt(f"{chat_mode}.txt")}]

        # 履歴追加（フィルタリング最適化）
        if messages_history:
            messages.extend(
                {"role": msg.role, "content": msg.content}
                for msg in messages_history
                if msg.content != "INITIAL_GREETING"
            )

        # 辞書データ追加
        if dictionary_data:
            messages.append({"role": "system", "content": f"Dictionary Data: {json.dumps(dictionary_data)}"})

        # ユーザー入力（フロントからの挨拶を変換）
        content = "Hello! Let's start." if user_input == "INITIAL_GREETING" else user_input
        messages.append({"role": "user", "content": content})

        def _ensure_cat_suffix(text: str) -> str:
            # コードブロック```...```内は変更しない。通常行の語尾に「にゃ」を補う。
            lines = text.splitlines()
            in_code = False
            processed = []
            suffix_pattern = re.compile(r"(にゃ|だにゃ)([。．!！?？…」』）\]\)]*)\s*$")
            for line in lines:
                s = line.rstrip()
                # コードブロックの開始/終了判定
                if s.strip().startswith("```"):
                    processed.append(line)
                    in_code = not in_code
                    continue
                if in_code:
                    processed.append(line)
                    continue
                # 空行やJSON/配列らしき開始は触らない（安全側）
                stripped = s.lstrip()
                if not stripped or stripped[0] in "[{":
                    processed.append(line)
                    continue
                # 既に「にゃ」「だにゃ」で終端していればそのまま
                if suffix_pattern.search(s):
                    processed.append(line)
                    continue
                # 語尾に句読点がある場合は、その直前に「にゃ」を挿入
                m = re.search(r"([。．!！?？…」』）\]\)])\s*$", s)
                if m:
                    end = m.group(1)
                    base = s[: s.rfind(end)]
                    new_line = base + "にゃ" + s[s.rfind(end):]
                    # 元の右側の空白は保持
                    processed.append(new_line + line[len(s):])
                else:
                    processed.append(s + "にゃ" + line[len(s):])
            return "\n".join(processed)

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7
            )
            content = response.choices[0].message.content or ""
            return _ensure_cat_suffix(content)
        except Exception as e:
            logger.error(f"LLM Error: {e}")
            return "エラーだニャ。少し休ませてニャ。"

llm_service = LLMService()
get_ai_response = llm_service.get_ai_response