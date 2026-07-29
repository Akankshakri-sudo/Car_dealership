from unittest.mock import patch

import pytest

from app.api.dependencies import get_current_user
from app.core.exceptions import AppException
from app.core.security import create_access_token
from app.database.models import User
from app.scripts.seed_admin import seed_admin_account


def test_user_model_repr():
    user = User(id=1, email="repr@test.com", role="customer")
    assert repr(user) == "<User(id=1, email='repr@test.com', role='customer')>"


def test_get_current_user_token_errors(db_session):
    # Token missing sub claim
    token1 = create_access_token({"email": "nosub@test.com"})

    class MockCreds1:
        credentials = token1

    with pytest.raises(AppException) as exc1:
        get_current_user(MockCreds1(), db_session)
    assert exc1.value.code == "INVALID_TOKEN"

    # Token with non-integer sub
    token2 = create_access_token({"sub": "abc"})

    class MockCreds2:
        credentials = token2

    with pytest.raises(AppException) as exc2:
        get_current_user(MockCreds2(), db_session)
    assert exc2.value.code == "INVALID_TOKEN"

    # Token for non-existent user ID
    token3 = create_access_token({"sub": "99999"})

    class MockCreds3:
        credentials = token3

    with pytest.raises(AppException) as exc3:
        get_current_user(MockCreds3(), db_session)
    assert exc3.value.code == "USER_NOT_FOUND"


def test_get_current_user_inactive_user(db_session):
    user = User(
        full_name="Inactive",
        email="inactive@test.com",
        password_hash="hash",
        role="customer",
        is_active=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    token = create_access_token({"sub": str(user.id)})

    class MockCreds:
        credentials = token

    with pytest.raises(AppException) as exc:
        get_current_user(MockCreds(), db_session)
    assert exc.value.code == "ACCOUNT_INACTIVE"


def test_seed_admin_script_execution(monkeypatch, db_session):
    monkeypatch.setenv("ADMIN_EMAIL", "seeded_admin@test.com")
    monkeypatch.setenv("ADMIN_PASSWORD", "AdminPassword@123")

    with patch("app.scripts.seed_admin.SessionLocal", return_value=db_session):
        seed_admin_account()

    admin = db_session.query(User).filter(User.email == "seeded_admin@test.com").first()
    assert admin is not None
    assert admin.role == "admin"

    # Re-running script updates password/role
    with patch("app.scripts.seed_admin.SessionLocal", return_value=db_session):
        seed_admin_account()
