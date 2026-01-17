# backend/app/services/llm_service.py
import os
import json
import logging
from openai import AsyncOpenAI
from .prompt_manager import prompt_manager

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def get_ai_response(self, *, user_input: str, chat_mode: str = "study", 
                             dictionary_data: dict = None, messages_history: list = None) -> str:
        
        # 1. モードに合わせたプロンプト取得（なければデフォルト）
        system_content = prompt_manager.get_prompt(f"{chat_mode}.txt")
        messages = [{"role": "system", "content": system_content}]

        # 2. 履歴追加（INITIAL_GREETINGは履歴に入れない方がAIが混乱しないニャ）
        if messages_history:
            for msg in messages_history:
                if msg.content != "INITIAL_GREETING":
                    messages.append({"role": msg.role, "content": msg.content})

        # 3. 辞書データ追加
        if dictionary_data:
            messages.append({"role": "system", "content": f"Dictionary Data: {json.dumps(dictionary_data)}"})

        # 4. ユーザー入力（フロントからの挨拶を変換）
        content = "Hello! Let's start." if user_input == "INITIAL_GREETING" else user_input
        messages.append({"role": "user", "content": content})

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"LLM Error: {e}")
            return "エラーだニャ。少し休ませてニャ。"

llm_service = LLMService()
get_ai_response = llm_service.get_ai_response