import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from app.services.chat_service import ChatService


@pytest.fixture
def chat_service():
    return ChatService()


async def test_initial_greeting_returns_without_saving(chat_service):
    """INITIAL_GREETING はDBに保存せず即レスポンスを返すこと"""
    db = MagicMock()

    with patch("app.services.chat_service.user_crud.get_or_create_user") as mock_user:
        mock_user.return_value = MagicMock(id=1)

        result = await chat_service.chat(
            db=db,
            firebase_uid="test_uid",
            user_message="INITIAL_GREETING",
            mode="study",
        )

    assert "reply" in result
    assert result["conversation_id"] is None
    # DBへのメッセージ保存が呼ばれていないこと
    db.add.assert_not_called()


async def test_chat_success(chat_service):
    """通常メッセージでAI応答と会話IDが返ること"""
    db = MagicMock()

    mock_user = MagicMock(id=1)
    mock_conv = MagicMock(
        id=10,
        conversation_uuid="test-uuid-123",
        messages=[],
        title=None,
    )

    with patch("app.services.chat_service.user_crud.get_or_create_user", return_value=mock_user), \
         patch("app.services.chat_service.chat_crud.get_conversation", return_value=None), \
         patch("app.services.chat_service.chat_crud.create_conversation", return_value=mock_conv), \
         patch("app.services.chat_service.chat_crud.create_message"), \
         patch("app.services.chat_service.get_ai_response", new_callable=AsyncMock, return_value="Hello! にゃ"), \
         patch.object(chat_service, "_extract_keyword", new_callable=AsyncMock, return_value=None):

        result = await chat_service.chat(
            db=db,
            firebase_uid="test_uid",
            user_message="Hello",
            mode="study",
        )

    assert result["reply"] == "Hello! にゃ"
    assert result["conversation_id"] == "test-uuid-123"


async def test_extract_keyword_returns_none_for_short_input(chat_service):
    """短すぎる入力はキーワード抽出しないこと"""
    result = await chat_service._extract_keyword("a")
    assert result is None


async def test_extract_keyword_returns_none_for_greeting(chat_service):
    """INITIAL_GREETING はキーワード抽出しないこと"""
    result = await chat_service._extract_keyword("INITIAL_GREETING")
    assert result is None


async def test_history_is_limited_to_20(chat_service):
    """LLMに送る履歴が最大20件に制限されること"""
    db = MagicMock()
    mock_user = MagicMock(id=1)

    # 30件のメッセージを持つ会話を用意
    messages = [MagicMock(role="user", content=f"msg{i}") for i in range(30)]
    mock_conv = MagicMock(
        id=10,
        conversation_uuid="test-uuid",
        messages=messages,
        title=None,
    )

    captured = {}

    async def fake_ai_response(**kwargs):
        captured["history"] = kwargs.get("messages_history", [])
        return "response にゃ"

    with patch("app.services.chat_service.user_crud.get_or_create_user", return_value=mock_user), \
         patch("app.services.chat_service.chat_crud.get_conversation", return_value=mock_conv), \
         patch("app.services.chat_service.chat_crud.create_message"), \
         patch("app.services.chat_service.get_ai_response", side_effect=fake_ai_response), \
         patch.object(chat_service, "_extract_keyword", new_callable=AsyncMock, return_value=None):

        await chat_service.chat(
            db=db,
            firebase_uid="test_uid",
            user_message="Hello",
            conversation_id="test-uuid",
            mode="study",
        )

    assert len(captured["history"]) == 20