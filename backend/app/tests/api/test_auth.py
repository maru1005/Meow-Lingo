def test_auth_valid_token(client, auth_headers, mock_auth_user):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200

def test_auth_invalid_token(client):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401

def test_auth_no_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401