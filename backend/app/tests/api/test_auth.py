# app/tests/api/test_auth.py

# 引数に mock_auth_user を追加して、正常系だけモックを有効にする
def test_auth_valid_token(client, auth_headers, mock_auth_user):
    response = client.get(
        "/api/v1/auth/me",
        headers=auth_headers
    )
    assert response.status_code == 200

# 異常系はモックを外す（本物のロジックに invalid_token を渡して 401 を出させる）
def test_auth_invalid_token(client):
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401

# トークンなし
def test_auth_no_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401