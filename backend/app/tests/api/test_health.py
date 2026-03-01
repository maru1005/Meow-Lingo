def test_health_check(client):
    # health ルーターにprefixがないので /api/ でアクセス
    response = client.get("/api/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"