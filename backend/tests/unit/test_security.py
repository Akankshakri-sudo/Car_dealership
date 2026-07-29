from datetime import timedelta

import pytest

from app.core.exceptions import AppException
from app.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)


def test_password_hashing_and_verification():
    raw_password = "Password@123"
    hashed = get_password_hash(raw_password)

    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_generation_and_decoding():
    data = {"sub": "1", "email": "test@example.com", "role": "customer"}
    token = create_access_token(data)

    assert isinstance(token, str)
    decoded = decode_access_token(token)
    assert decoded["sub"] == "1"
    assert decoded["email"] == "test@example.com"
    assert decoded["role"] == "customer"


def test_expired_jwt_token_raises_exception():
    data = {"sub": "1", "email": "test@example.com"}
    token = create_access_token(data, expires_delta=timedelta(seconds=-10))

    with pytest.raises(AppException) as exc_info:
        decode_access_token(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.code == "TOKEN_EXPIRED"


def test_invalid_jwt_token_raises_exception():
    invalid_token = "invalid.token.string"

    with pytest.raises(AppException) as exc_info:
        decode_access_token(invalid_token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.code == "INVALID_TOKEN"
