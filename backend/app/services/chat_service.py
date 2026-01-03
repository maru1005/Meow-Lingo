# backend/app/services/chat_service.py
from sqlalchemy.orm import Session

# 内部リポジトリ
from app.repositories.user_repository import get_or_create_user
from app.repositories.conversation_repository import get_or_create_active_conversation, create_conversation, list_user_conversations
from app.repositories.message_repository import create_message, list_messages_by_conversation
from app.repositories.dictionary_cache_repository import get_cache, create_cache

# 外部サービス
from app.services.llm_service import get_ai_response
from app.services.dictionary_service import fetch_dictionary_data

class ChatService:
    """
    チャット機能の業務ロジックをまとめたService。
    辞書データの取得（RAG）、DB保存、AI応答生成を管理します。
    """
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
        user = get_or_create_user(db=db, firebase_uid=firebase_uid, email=email)

        # 2. Conversation（会話セッション）を取得 or 作成
        conversation = get_or_create_active_conversation(db=db, user_id=user.id)

        # 3. ユーザーの発言をDBに保存
        create_message(
            db=db, 
            conversation_id=conversation.id, 
            content=user_message, 
            role="user"
        )

        # 4. 辞書キャッシュ（RAG）の処理
        dictionary_context = None
        # 辞書キャッシュを検索するためのキーワード抽出
        searchkeyword = await self._extract_keyword(user_message)
        # 辞書キャッシュをDBから取得
        if searchkeyword:
            cache = get_cache(db=db, word=searchkeyword, language=language)

            if cache:
                # キャッシュがある場合、そのデータを使う
                dictionary_context = cache.response
            else:
                # キャッシュにない場合、外部API（Free Dictionary API）から取得
                dictionary_response = await fetch_dictionary_data(word=searchkeyword)
            
                if dictionary_response:
                # 取得したデータをDBにキャッシュ保存（次回以降の高速化）
                    create_cache(
                        db=db,
                        word=searchkeyword,
                        language=language,
                        response=dictionary_response,
                    )
                    dictionary_context = dictionary_response

        # 5. 会話履歴を取得（将来的な文脈理解用）
        messages_history = list_messages_by_conversation(
            db=db, 
            conversation_id=conversation.id
        )

        # 6. AI（LLM）を呼び出す
        # 取得した辞書データを添えて、AIに回答を依頼
        ai_reply = await get_ai_response(
            user_input=user_message,
            dictionary_data=dictionary_context,
            messages_history=messages_history,
            searchkeyword=searchkeyword,
        )

        # 7. AIの回答をDBに保存
        create_message(
            db=db, 
            conversation_id=conversation.id, 
            content=ai_reply, 
            role="assistant"
        )

        # 8. フロントエンドへ返すレスポンスを構成
        return {
            "conversation_id": str(conversation.conversation_uuid),
            "reply": ai_reply,
        }
    
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
        user = get_or_create_user(db=db, firebase_uid=firebase_uid, email=email)

        # 2. Conversation（会話セッション）を取得 or 作成
        conversation = get_or_create_active_conversation(db=db, user_id=user.id)

        # 3. ユーザーの発言をDBに保存
        create_message(
            db=db, 
            conversation_id=conversation.id, 
            content=user_message, 
            role="user"
        )

        # 4. 辞書キャッシュ（RAG）の処理
        dictionary_context = None
        # 辞書キャッシュを検索するためのキーワード抽出
        searchkeyword = await self._extract_keyword(user_message)
        
        # 辞書キャッシュをDBから取得
        if searchkeyword:
            cache = get_cache(db=db, word=searchkeyword, language=language)

            if cache:
                dictionary_context = cache.response
            else:
                dictionary_response = await fetch_dictionary_data(word=searchkeyword)
            
                if dictionary_response:
                    create_cache(
                        db=db,
                        word=searchkeyword,
                        language=language,
                        response=dictionary_response,
                    )
                    dictionary_context = dictionary_response

        # 5. 会話履歴を取得
        messages_history = list_messages_by_conversation(
            db=db, 
            conversation_id=conversation.id
        )

        # 6. AI（LLM）を呼び出す
        ai_reply = await get_ai_response(
            user_input=user_message,
            dictionary_data=dictionary_context,
            messages_history=messages_history,
            searchkeyword=searchkeyword,
        )

        # 7. AIの回答をDBに保存
        create_message(
            db=db, 
            conversation_id=conversation.id, 
            content=ai_reply, 
            role="assistant"
        )

        # 8. フロントエンドへ返すレスポンスを構成
        return {
            "conversation_id": str(conversation.conversation_uuid),
            "reply": ai_reply,
        }

    # === 追加機能：会話リセット ===
    def reset_conversation(
        self,
        db: Session,
        *,
        firebase_uid: str,
    ):
        user = get_or_create_user(db=db, firebase_uid=firebase_uid)
        conversation = create_conversation(db=db, user_id=user.id)
        return conversation

    # === 追加機能：会話一覧取得 ===
    def list_conversations(
        self,
        db: Session,
        *,
        firebase_uid: str,
    ):
        user = get_or_create_user(db=db, firebase_uid=firebase_uid)
        # コンフリクト元のタイポ「list_user_conversation」を修正済み
        conversations = list_user_conversations(db=db, user_id=user.id)
        return conversations

    # === 内部ヘルパー ===
    async def _extract_keyword(self, text: str) -> str | None:
        prompt = f"以下のテキストから、英語学習辞書で調べるべき英単語を1つだけ抜き出してください。英単語のみを返してください。該当がない場合は 'None' と返してください。\n\nテキスト: {text}"
        keyword = await get_ai_response(user_input=prompt)
        clean_keyword = keyword.strip().lower().replace(".", "").replace('"', '').replace("'", "")
        
        if not clean_keyword or "none" in clean_keyword:
            return None
        return clean_keyword