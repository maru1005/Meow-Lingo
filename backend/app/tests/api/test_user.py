import pytest

def test_get_me_success(client, auth_headers, mock_auth_user):
    """
    認証済みユーザーが自分の情報を取得できるか
    """
    response = client.get(
        "/api/v1/user/me", 
        headers=auth_headers
    )
    assert response.status_code == 200
    
    data = response.json()
    # conftest.py の mock_auth_user フィクスチャで定義した値と一致するか
    assert data["email"] == "test@example.com"
    assert data["firebase_uid"] == "firebase_uid_123"

def test_get_me_no_auth(client):
    """
    認証なしで 401 が返るか
    """
    response = client.get("/api/v1/user/me")
    
    # Depends(get_current_user) を入れたので、401が返るようになる
    assert response.status_code == 401