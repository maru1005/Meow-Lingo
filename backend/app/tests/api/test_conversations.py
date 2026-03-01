def test_get_conversations_unauthorized(client):
    response = client.get("/api/chat/conversations")
    assert response.status_code == 401


def test_get_conversations_authorized(client, auth_headers, mock_auth_user, monkeypatch):
    """認証済みなら200 + リストが返ること（DBは空でOK）"""
    from app.api import chat as chat_module

    monkeypatch.setattr(
        chat_module.chat_service,
        "list_conversations",
        lambda db, firebase_uid: [],
    )

    response = client.get("/api/chat/conversations", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []