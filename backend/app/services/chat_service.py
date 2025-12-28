# backend/app/services/llm_service.py
from sqlalchemy.orm import Session
from app.repositories.user_repository import (
    get_or_create_by_firebase_uid,
)
from app.repositories.conversation_repository import (
    get_or_create_active_conversation,
)
from app.repositories.message_repository import (
    create_message,
    list_messages_by_conversation,
)
from app.repositories.dictionary_cache_repository import (
    get_cache,
    create_cache,
)

# LLM / 辞書API は service 配下に置く想定
from app.services.llm_service import generate_ai_reply
from app.services.dictionary_service import fetch_dictionary_definition


class ChatService: # コロン忘れ
    """
    チャット機能の業務ロジックをまとめた Service。

    - 会話管理
    - Message 永続化
    - 辞書キャッシュ（RAG）
    - LLM 呼び出し
    """
    def chat(
        self, 
        db: Session,
        *,
        firebase_uid: str,
        user_message: str,
        email: str | None = None,
        language: str = "en",
    ) -> dict:
        """
        チャットを1往復処理するメイン関数。

        戻り値：
        {
            "conversation_id": str (UUID),
            "reply": str,
        }
        """

        # ------------------------------------
        # 1. User を取得 or 作成
        # ------------------------------------
        user = get_or_create_by_firebase_uid(
            db=db,
            firebase_uid=firebase_uid,
            email=email,
        )

        # ------------------------------------
        # 2. Conversation を取得 or 作成
        # ------------------------------------
        conversation = get_or_create_active_conversation(
            db=db,
            user_id=user.id,
        )

        # ------------------------------------
        # 3. ユーザー発言を Message として保存
        # ------------------------------------
        create_message(
            db=db,
            conversation_id=conversation.id,
            content=user_message,
            role="user",
        )

        # ------------------------------------
        # 4. 辞書キャッシュ（RAG）
        # ------------------------------------
        dictionary_context = None

        cache = get_cache(
            db=db,
            word=user_message,
            language=language,
        )

        if cache:
            dictionary_context = cache.response
        else:
                # 辞書APIを呼ぶ
                dictionary_response =fetch_dictionary_definition(
                    word=user_message,
                    language=language,
                )

        if dictionary_response:
                    create_cache(
                        db=db,
                        word=user_message,
                        language=language,
                        response=dictionary_response,
                    )
                    dictionary_context = dictionary_response

        # ------------------------------------
        # 5. 会話履歴を取得（LLM用）
        # ------------------------------------
        messages_history = list_messages_by_conversation( # 履歴のためhistory追加　変数定義が違っていたためmessagesに揃える
            db=db,
            conversation_id=conversation.id,
        )

        # ------------------------------------
        # 6. LLM を呼び出す
        # ------------------------------------
        ai_reply = generate_ai_reply(
            messages=messages,
            dictionary_context=dictionary_context,
        )

        # ------------------------------------
        # 7. AI発言を Message として保存
        # ------------------------------------
        create_message(
            db=db,
            conversation_id=conversation.id,
            content=ai_reply,
            role="assistant",
        )

        # ------------------------------------
        # 8. レスポンス返却
        # ------------------------------------
        return {
            "conversation_id": str(conversation.conversation_uuid),
            "reply": ai_reply,
        }
