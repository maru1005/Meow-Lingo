import pytest
from fastapi.testclient import TestClient
from types import SimpleNamespace
from datetime import datetime

from app.main import app
from app.dependencies.auth import get_current_user
import uuid

# 1. APIを叩くためのクライアント
@pytest.fixture
def client():
    # dependency_overrides をテストごとにリセットするための設定
    with TestClient(app) as c:
        yield c
    app.dependency_overrides = {}

# 2. テストで使い回す共通ヘッダー
@pytest.fixture
def auth_headers():
    return {
        "Authorization": "Bearer valid_firebase_id_token"
    }

# 3. 正常系の認証ユーザーモック
@pytest.fixture
def mock_auth_user():
    """
    正常系：辞書アクセスもプロパティアクセスも可能なモック
    auth.py と chat.py の両方をパスさせる
    """
    user_data = {
        "firebase_uid": "firebase_uid_123",
        "email": "test@example.com",
        "id": "dummy-db-id",
        "created_at": datetime.now()
    }

    # オブジェクト形式に変換（chat.py の current_user.firebase_uid 対策）
    user_obj = SimpleNamespace(**user_data)

    # FastAPIの依存関係を上書き
    app.dependency_overrides[get_current_user] = lambda: user_obj
    
    yield user_obj
    
    # テストが終わったら上書きを解除
    app.dependency_overrides = {}


@pytest.fixture
def mock_chat_service(monkeypatch):
    async def fake_chat(*args, **kwargs):
        return {
            "conversation_id": "test-conversation-id",
            "reply": "This is a mock response"
        }

    from app.api.v1.endpoints import chat

    monkeypatch.setattr(
        chat.chat_service,
        "chat",
        fake_chat
    )


@pytest.fixture
def mock_chat_reset(monkeypatch):
    """
    chat_service.reset_conversation をモック
    """
    class DummyConversation:
        conversation_uuid = uuid.uuid4()

    def fake_reset_conversation(*args, **kwargs):
        return DummyConversation()

    from app.api.v1.endpoints.chat import chat_service
    monkeypatch.setattr(
        chat_service,
        "reset_conversation",
        fake_reset_conversation
    )

@pytest.fixture
def db_session():
    # 実際には MagicMock 等を使って DB 操作を擬似化します
    from unittest.mock import MagicMock
    return MagicMock()