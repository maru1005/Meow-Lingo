def test_chat_reset_success(
    client,
    auth_headers,
    mock_auth_user,
    mock_chat_reset
):
    response = client.post(
        "/api/v1/chat/reset",
        headers=auth_headers
    )

    assert response.status_code == 200
    body = response.json()

    assert "conversation_id" in body
    assert isinstance(body["conversation_id"], str)


def test_chat_reset_requires_auth(client):
    response = client.post("/api/v1/chat/reset")
    assert response.status_code == 401
