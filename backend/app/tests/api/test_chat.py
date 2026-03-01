def test_chat_success(client, auth_headers, mock_auth_user, mock_chat_service):
    payload = {
        "message": "Hello",
        "mode": "study",
        "conversation_id": None,
    }
    response = client.post("/api/chat", json=payload, headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert data["reply"] == "This is a mock response"
    assert data["conversation_id"] is not None


def test_chat_requires_auth(client):
    response = client.post(
        "/api/chat",
        json={"message": "Hello", "mode": "study"},
    )
    assert response.status_code == 401