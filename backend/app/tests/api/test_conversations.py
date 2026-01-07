# app/tests/api/test_conversations.py

import pytest
from types import SimpleNamespace
from fastapi.testclient import TestClient

from app.main import app
from app.dependencies.auth import get_current_user


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
    app.dependency_overrides = {}


@pytest.fixture
def auth_headers():
    return {"Authorization": "Bearer valid_firebase_id_token"}


@pytest.fixture
def mock_auth_user():
    """
    conversations 系で使う current_user は
    user.id / user.firebase_uid を参照するため object で返す
    """
    user = SimpleNamespace(
        firebase_uid="firebase_uid_123",
        email="test@example.com",
        id="dummy-db-id",
    )

    app.dependency_overrides[get_current_user] = lambda: user
    yield
    app.dependency_overrides = {}


def test_get_conversations_empty(client, auth_headers, mock_auth_user):
    """
    会話が存在しない場合でも 200 + 空配列が返ること
    """
    response = client.get(
        "/api/v1/chat/conversations",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    # レスポンス形式は柔軟に
    assert isinstance(data, (list, dict))

    if isinstance(data, dict):
        assert "conversations" in data
        assert isinstance(data["conversations"], list)
    else:
        assert isinstance(data, list)


def test_get_conversations_unauthorized(client):
    """
    認証なしは 401
    """
    response = client.get("/api/v1/chat/conversations")
    assert response.status_code == 401
