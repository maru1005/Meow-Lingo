# app/services/chat_service.py
from sqlalchemy.orm import Session
from app.repositories.user_repository import get_or_create_by_firebase_uid
from app.repositories.conversation_repository import get_or_create_active_conversation
from app.repositories.message_repository import create_message, list_messages_by_conversation
from app.repositories.dictionary_cache_repository import get_cache, create_cache

# ★私たちが作ったサービスをインポート（関数名を合わせました
from app.services.llm_service import get_ai_response
from app.services.dictionary_service import fetch_dictionary_data

class ChatService:
    async def chat(
        self, 
        db: Session,
        *,
        firebase_uid: str,
        user_message: str,
        email: str | None = None,
        language: str = "en",
    ) -> dict:
        # 1. User を取得 or 作成
        user = get_or_create_by_firebase_uid(db=db, firebase_uid=firebase_uid, email=email)

        # 2. Conversation を取得 or 作成
        conversation = get_or_create_active_conversation(db=db, user_id=user.id)

        # 3. ユーザー発言を Message として保存
        create_message(db=db, conversation_id=conversation.id, content=user_message, role="user")

        # ------------------------------------
        # 4. 辞書キャッシュ（RAG）の処理
        # ------------------------------------
        dictionary_context = None
        # まずはDB（キャッシュ）を探す
        cache = get_cache(db=db, word=user_message, language=language)

        if cache:
            dictionary_context = cache.response
        else:
            # キャッシュにない場合、外部API（Free Dictionary API）を叩く
            # ★awaitをつけて、私たちが作った関数を呼び出す
            dictionary_response = await fetch_dictionary_data(word=user_message)
            
            if dictionary_response:
                # 取得できたら、次回のためにDBに保存（キャッシュ）しておく
                create_cache(
                    db=db,
                    word=user_message,
                    language=language,
                    response=dictionary_response,
                )
                dictionary_context = dictionary_response

        # 5. 会話履歴を取得（必要に応じてLLMに渡す用）
        # ※チームのコードで「messages」が「message」になっていたのを修正
        messages_history = list_messages_by_conversation(db=db, conversation_id=conversation.id)

        # ------------------------------------
        # 6. LLM を呼び出す
        # ------------------------------------
        ai_reply = await get_ai_response(
            user_input=user_message,
            dictionary_data=dictionary_context,
        )

        # 7. AI発言を Message として保存
        create_message(db=db, conversation_id=conversation.id, content=ai_reply, role="assistant")

        # 8. レスポンス返却
        return {
            "conversation_id": str(conversation.conversation_uuid),
            "reply": ai_reply,
        }