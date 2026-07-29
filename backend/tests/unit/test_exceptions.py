from fastapi.testclient import TestClient

from app.core.exceptions import AppException
from app.main import app

client = TestClient(app)


def test_custom_app_exception_returns_formatted_json():
    @app.get("/api/test-error")
    def trigger_error():
        raise AppException(
            status_code=400,
            code="INVALID_TEST_PARAM",
            message="Test parameter is invalid.",
            details={"field": "test_field"},
        )

    response = client.get("/api/test-error")
    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "INVALID_TEST_PARAM",
            "message": "Test parameter is invalid.",
            "details": {"field": "test_field"},
        }
    }
