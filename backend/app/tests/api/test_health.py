def test_health_check(client):
    # /api/health ではなく /api/v1/health に修正
    response = client.get("/api/v1/health")

    print(f"\nStatus Code: {response.status_code}")
    print(f"Response Body: {response.json()}")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}