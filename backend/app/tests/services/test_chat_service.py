import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from app.services.chat_service import ChatService  # 正しいインポート

@pytest.fixture
def chat_service():
    """ChatServiceのインスタンスを作成（DBはメソッドごとに渡すのでここでは不要）"""
    return ChatService()

@pytest.mark.asyncio  # 非同期テストを有効にする
async def test_chat_success(chat_service):
    """
    チャットメソッドが正常に動作し、期待されるレスポンスを返すかテスト
    """
    # 1. 依存関係のモック作成
    db = MagicMock()
    
    # 2. 外部関数/リポジトリのモック化
    # patchのパスは「その関数が使われている場所」を指定します
    with patch("app.services.chat_service.get_or_create_user") as mock_user, \
         patch("app.services.chat_service.get_or_create_active_conversation") as mock_conv, \
         patch("app.services.chat_service.create_message") as mock_msg, \
         patch("app.services.chat_service.get_ai_response", new_callable=AsyncMock) as mock_ai:

        # モックの戻り値を設定
        mock_user.return_value = MagicMock(id=1)
        mock_conv.return_value = MagicMock(id=10, conversation_uuid="test-uuid-123")
        mock_ai.return_value = "Hello! I am AI."

        # 3. 実行
        result = await chat_service.chat(
            db=db,
            firebase_uid="test_uid",
            user_message="Hello",
            email="test@example.com"
        )

        # 4. 検証
        assert result["reply"] == "Hello! I am AI."
        assert result["conversation_id"] == "test-uuid-123"
        
        # ユーザーのメッセージとAIのメッセージで2回呼ばれているはず
        assert mock_msg.call_count == 2
        mock_ai.assert_called()

@pytest.mark.asyncio
async def test_extract_keyword(chat_service):
    """
    内部ヘルパー _extract_keyword のテスト
    """
    with patch("app.services.chat_service.get_ai_response", new_callable=AsyncMock) as mock_ai:
        mock_ai.return_value = " Apple. "  # 余計な空白やドットを含める
        
        keyword = await chat_service._extract_keyword("What is an apple?")
        
        # クリーニング処理が正しく行われているか
        assert keyword == "apple"