import pytest
from fastapi.testclient import TestClient
from types import SimpleNamespace
from datetime import datetime
from unittest.mock import MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

from app.main import app
from app.core.database import Base, get_db
from app.dependencies.auth import get_current_user


# ── テスト用DBセットアップ ────────────────────────────────
TEST_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@db-test:5432/test_db"
)

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    """テストセッション開始時にテーブルを作成し、終了時に削除する"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    """テストごとにクリーンなDBセッションを提供し、テスト後にロールバック"""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()  # テスト後に変更を元に戻す
    connection.close()


# ── クライアント ──────────────────────────────────────────
@pytest.fixture
def client(db):
    """テスト用DBを使うHTTPクライアント"""
    app.dependency_overrides[get_db] = lambda: db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides = {}


# ── 認証ヘッダー ──────────────────────────────────────────
@pytest.fixture
def auth_headers():
    return {"Authorization": "Bearer valid_firebase_id_token"}


# ── 認証ユーザーモック ────────────────────────────────────
@pytest.fixture
def mock_auth_user():
    """get_current_user を差し替えて Firebase 認証をスキップする"""
    user = SimpleNamespace(
        firebase_uid="firebase_uid_123",
        email="test@example.com",
        id=1,
        created_at=datetime.now(),
    )
    app.dependency_overrides[get_current_user] = lambda: user
    yield user
    app.dependency_overrides.pop(get_current_user, None)


# ── ChatService モック ────────────────────────────────────
@pytest.fixture
def mock_chat_service(monkeypatch):
    """chat エンドポイントの ChatService.chat をモック"""
    async def fake_chat(*args, **kwargs):
        return {
            "conversation_id": "test-conversation-id",
            "reply": "This is a mock response",
            "title": None,
        }

    from app.api import chat as chat_module
    monkeypatch.setattr(chat_module.chat_service, "chat", fake_chat)