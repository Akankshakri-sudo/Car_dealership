from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.database.models import User


def test_register_customer_success(client: TestClient, db_session: Session):
    payload = {
        "full_name": "Akanksha Kumari",
        "email": "akanksha@example.com",
        "password": "Password@123",
    }
    response = client.post("/api/auth/register", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "akanksha@example.com"
    assert data["full_name"] == "Akanksha Kumari"
    assert data["role"] == "customer"
    assert data["is_active"] is True
    assert "password_hash" not in data

    # Verify database record and hashed password
    user = db_session.execute(
        select(User).where(User.email == "akanksha@example.com")
    ).scalar_one()
    assert user.role == "customer"
    assert verify_password("Password@123", user.password_hash) is True


def test_register_cannot_grant_admin_role(client: TestClient, db_session: Session):
    payload = {
        "full_name": "Sneaky User",
        "email": "sneaky@example.com",
        "password": "Password@123",
        "role": "admin",  # Client trying to force admin role
    }
    response = client.post("/api/auth/register", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["role"] == "customer"  # Server MUST override/ignore and assign customer

    user = db_session.execute(
        select(User).where(User.email == "sneaky@example.com")
    ).scalar_one()
    assert user.role == "customer"


def test_register_duplicate_email_rejected(client: TestClient):
    payload = {
        "full_name": "User One",
        "email": "duplicate@example.com",
        "password": "Password@123",
    }
    res1 = client.post("/api/auth/register", json=payload)
    assert res1.status_code == 201

    # Attempt second registration with same email
    res2 = client.post("/api/auth/register", json=payload)
    assert res2.status_code == 409
    assert res2.json()["error"]["code"] == "EMAIL_ALREADY_EXISTS"


def test_register_invalid_email_and_password_validation(client: TestClient):
    # Invalid email format
    res1 = client.post(
        "/api/auth/register",
        json={
            "full_name": "Bad Email",
            "email": "not-an-email",
            "password": "Password@123",
        },
    )
    assert res1.status_code == 422

    # Weak password (< 8 chars)
    res2 = client.post(
        "/api/auth/register",
        json={
            "full_name": "Weak Pass",
            "email": "weak@example.com",
            "password": "short",
        },
    )
    assert res2.status_code == 422


def test_login_success(client: TestClient):
    # Register first
    client.post(
        "/api/auth/register",
        json={
            "full_name": "Test Login",
            "email": "login@example.com",
            "password": "Password@123",
        },
    )

    # Login
    response = client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "Password@123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login@example.com"


def test_login_invalid_credentials_returns_generic_401(client: TestClient):
    # Non-existent email
    res1 = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@example.com", "password": "Password@123"},
    )
    assert res1.status_code == 401
    assert res1.json()["error"]["code"] == "INVALID_CREDENTIALS"

    # Register user then pass wrong password
    client.post(
        "/api/auth/register",
        json={
            "full_name": "User Two",
            "email": "user2@example.com",
            "password": "Password@123",
        },
    )
    res2 = client.post(
        "/api/auth/login",
        json={"email": "user2@example.com", "password": "WrongPassword@123"},
    )
    assert res2.status_code == 401
    assert res2.json()["error"]["code"] == "INVALID_CREDENTIALS"


def test_get_me_authenticated_success(client: TestClient):
    # Register & Login
    client.post(
        "/api/auth/register",
        json={
            "full_name": "Me User",
            "email": "me@example.com",
            "password": "Password@123",
        },
    )
    login_res = client.post(
        "/api/auth/login", json={"email": "me@example.com", "password": "Password@123"}
    )
    token = login_res.json()["access_token"]

    # Call /api/auth/me with Bearer token
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    data = me_res.json()
    assert data["email"] == "me@example.com"
    assert data["full_name"] == "Me User"


def test_get_me_unauthenticated_returns_401(client: TestClient):
    # Missing token
    res1 = client.get("/api/auth/me")
    assert res1.status_code == 401

    # Invalid token
    res2 = client.get("/api/auth/me", headers={"Authorization": "Bearer invalidtoken"})
    assert res2.status_code == 401
