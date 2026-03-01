# backend/app/services/chat_service.py
import asyncio
from sqlalchemy.orm import Session
from app.crud import chat as chat_crud
from app.crud import user as user_crud
from app.crud import dictionary as dict_crud
from app.services.llm_service import get_ai_response, get_internal_json
from app.services.dictionary_service import fetch_dictionary_data

# LLMに送る履歴の上限（古いメッセージによるトークン超過・コスト爆発を防ぐ）
MAX_HISTORY_MESSAGES = 20


class ChatService:
    async def chat(self, db: Session, *, firebase_uid: str, user_message: str, 
                   conversation_id: str | None = None, mode: str = "study") -> dict:
        
        # 1. User取得
        user = user_crud.get_or_create_user(db, firebase_uid=firebase_uid)

        if user_message == "INITIAL_GREETING":
            greetings = {
                "study": "今日は何するにゃ？フリートークでもなんでも聞いてにゃ〜！",
                "vocabulary": "今日はどんな新しい単語を覚えよかにゃ？一緒に特訓するにゃ！",
                "grammar": "現在・過去・未来...難しい文法もMeowにお任せにゃ！何からやるにゃ？",
                "test": "にゃー！どんなテストにするにゃ？覚悟はいいかにゃ？"
            }
            return {
                "conversation_id": None,
                "reply": greetings.get(mode, "こんにちにゃ！Meow Englishへようこそだにゃ！"),
            }

        # 2. 会話の特定
        conversation = None
        if conversation_id:
            conversation = chat_crud.get_conversation(db, conversation_id, user.id)

        # 3. ユーザー発言の保存（遅延作成）
        if user_message != "INITIAL_GREETING":
            if not conversation:
                conversation = chat_crud.create_conversation(db, user.id, mode=mode)
            chat_crud.create_message(db, conversation.id, user_message, "user")

        # 4. 辞書RAG処理
        dictionary_context = None
        if user_message != "INITIAL_GREETING":
            search_word = await self._extract_keyword(user_message)
            if search_word:
                cache = dict_crud.get_or_create_cache(db, search_word, "en")
                if cache:
                    dictionary_context = cache.response
                else:
                    dict_res = await fetch_dictionary_data(search_word)
                    if dict_res:
                        dict_crud.create_cache(db, search_word, "en", dict_res)
                        dictionary_context = dict_res

        # 5. AI応答生成（直近 MAX_HISTORY_MESSAGES 件のみ送信）
        all_messages = conversation.messages if conversation else []
        history = all_messages[-MAX_HISTORY_MESSAGES:]
        ai_reply = await get_ai_response(
            user_input=user_message,
            chat_mode=mode,
            dictionary_data=dictionary_context,
            messages_history=history
        )

        # 6. AI応答の保存
        if conversation:
            chat_crud.create_message(db, conversation.id, ai_reply, "assistant")

        # 7. レスポンス
        return {
            "conversation_id": str(conversation.conversation_uuid) if conversation else None,
            "reply": ai_reply,
            "title": conversation.title if conversation else None
        }

    def list_conversations(self, db: Session, firebase_uid: str):
        user = user_crud.get_or_create_user(db, firebase_uid=firebase_uid)
        return chat_crud.list_conversations(db, user.id)

    def get_conversation_detail(self, db: Session, conversation_id: str, firebase_uid: str):
        user = user_crud.get_or_create_user(db, firebase_uid=firebase_uid)
        return chat_crud.get_conversation(db, conversation_id, user.id)

    def delete_conversation(self, db: Session, conversation_id: str, firebase_uid: str) -> bool:
        user = user_crud.get_or_create_user(db, firebase_uid=firebase_uid)
        return chat_crud.delete_conversation(db, conversation_id, user.id)

    def update_title(self, db: Session, conversation_id: str, user_id: int, title: str):
        conv = chat_crud.get_conversation(db, conversation_id, user_id)
        if conv:
            conv.title = title
            db.commit()

    async def _extract_keyword(self, text: str) -> str | None:
        if text == "INITIAL_GREETING":
            return None
        if len(text.strip()) < 2:
            return None

        system_prompt = (
            "You are a strict information extraction engine. Return ONLY valid JSON. "
            "Extract exactly one English word suitable for dictionary lookup from the input. "
            "If none, return null. Lowercase the word. No extra keys."
        )
        data = await get_internal_json(
            system_prompt=system_prompt,
            user_input=f"Input: {text}",
            temperature=0.0,
            default={"word": None},
        )
        word = data.get("word")
        if not isinstance(word, str) or not word.strip():
            return None
        word = word.strip().split()[0].strip("\"'.,:;!?()[]{}")
        return word.lower() if word else None