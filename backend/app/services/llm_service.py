import os
import json
import logging
import re
from openai import AsyncOpenAI
from openai import APITimeoutError, RateLimitError, APIStatusError
from .prompt_manager import prompt_manager

logger = logging.getLogger(__name__)

# 環境変数で上書き可能にする
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_TIMEOUT = float(os.getenv("OPENAI_TIMEOUT_SECONDS", "30"))
OPENAI_MAX_RETRIES = int(os.getenv("OPENAI_MAX_RETRIES", "2"))


class LLMService:
    _client = None

    def __init__(self):
        if LLMService._client is None:
            LLMService._client = AsyncOpenAI(
                api_key=os.getenv("OPENAI_API_KEY"),
                timeout=OPENAI_TIMEOUT,       # 30秒でタイムアウト
                max_retries=OPENAI_MAX_RETRIES # 429/5xx を最大2回リトライ（指数バックオフ）
            )
        self.client = LLMService._client

    async def get_ai_response(self, *, user_input: str, chat_mode: str = "study",
                              dictionary_data: dict = None, messages_history: list = None) -> str:

        system_prompt = prompt_manager.get_prompt_for_mode(chat_mode)
        messages = [{"role": "system", "content": system_prompt}]

        # 履歴追加
        if messages_history:
            messages.extend(
                {"role": msg.role, "content": msg.content}
                for msg in messages_history
                if msg.content != "INITIAL_GREETING"
            )

        # 辞書データ追加
        if dictionary_data:
            messages.append({"role": "system", "content": f"Dictionary Data: {json.dumps(dictionary_data)}"})

        content = "Hello! Let's start." if user_input == "INITIAL_GREETING" else user_input
        messages.append({"role": "user", "content": content})

        try:
            response = await self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=messages,
                temperature=0.7
            )
            content = response.choices[0].message.content or ""
            return self._ensure_cat_suffix(content)
        except APITimeoutError:
            logger.error("LLM timeout: OpenAI did not respond in time")
            return "タイムアウトしたにゃ。もう一度話しかけてにゃ。"
        except RateLimitError:
            logger.error("LLM rate limit exceeded")
            return "少し混んでるにゃ。少し待ってからもう一度試してにゃ。"
        except APIStatusError as e:
            logger.error(f"LLM API error {e.status_code}: {e.message}")
            return "エラーだニャ。少し休ませてニャ。"
        except Exception as e:
            logger.error(f"LLM unexpected error: {e}", exc_info=True)
            return "エラーだニャ。少し休ませてニャ。"

    def _ensure_cat_suffix(self, text: str) -> str:
        lines = text.splitlines()
        in_code = False
        processed = []
        suffix_pattern = re.compile(r"(にゃ|だにゃ)([。．!！?？…」』）\]\)]*)\s*$")
        for line in lines:
            s = line.rstrip()
            if s.strip().startswith("```"):
                processed.append(line)
                in_code = not in_code
                continue
            if in_code:
                processed.append(line)
                continue
            stripped = s.lstrip()
            if not stripped or stripped[0] in "[{":
                processed.append(line)
                continue
            if suffix_pattern.search(s):
                processed.append(line)
                continue
            m = re.search(r"([。．!！?？…」』）\]\)])\s*$", s)
            if m:
                end = m.group(1)
                base = s[: s.rfind(end)]
                new_line = base + "にゃ" + s[s.rfind(end):]
                processed.append(new_line + line[len(s):])
            else:
                processed.append(s + "にゃ" + line[len(s):])
        return "\n".join(processed)

    async def get_internal_response(
        self,
        *,
        system_prompt: str,
        user_input: str,
        temperature: float = 0.0,
        force_json: bool = False,
    ) -> str:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input},
        ]
        try:
            kwargs = {}
            if force_json:
                kwargs["response_format"] = {"type": "json_object"}
            response = await self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=messages,
                temperature=temperature,
                **kwargs,
            )
            return (response.choices[0].message.content or "").strip()
        except Exception as e:
            logger.error(f"LLM Internal Error: {e}", exc_info=True)
            return ""

    async def get_internal_json(
        self,
        *,
        system_prompt: str,
        user_input: str,
        temperature: float = 0.0,
        default: dict | None = None,
    ) -> dict:
        raw = await self.get_internal_response(
            system_prompt=system_prompt,
            user_input=user_input,
            temperature=temperature,
            force_json=True,
        )
        try:
            obj = json.loads(raw) if raw else None
            return obj if isinstance(obj, dict) else (default or {})
        except Exception:
            return default or {}


llm_service = LLMService()
get_ai_response = llm_service.get_ai_response
get_internal_response = llm_service.get_internal_response
get_internal_json = llm_service.get_internal_json