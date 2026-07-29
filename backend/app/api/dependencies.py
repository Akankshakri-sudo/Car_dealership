from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.security import decode_access_token
from app.database.models import User
from app.database.session import get_db
from app.repositories.user_repository import UserRepository

security_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Extract and validate JWT token from Authorization header and return current User."""
    if not credentials or not credentials.credentials:
        raise AppException(
            status_code=401,
            code="AUTHENTICATION_REQUIRED",
            message="Authentication credentials were not provided.",
        )

    token = credentials.credentials
    payload = decode_access_token(token)

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise AppException(
            status_code=401,
            code="INVALID_TOKEN",
            message="Invalid authentication payload.",
        )

    try:
        user_id = int(user_id_str)
    except ValueError:
        raise AppException(
            status_code=401,
            code="INVALID_TOKEN",
            message="Invalid user identifier in token.",
        )

    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        raise AppException(
            status_code=401,
            code="USER_NOT_FOUND",
            message="The user associated with this token no longer exists.",
        )

    if not user.is_active:
        raise AppException(
            status_code=403,
            code="ACCOUNT_INACTIVE",
            message="User account is inactive.",
        )

    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Guard dependency restricting access to administrator users only."""
    if current_user.role != "admin":
        raise AppException(
            status_code=403,
            code="FORBIDDEN_ADMIN_REQUIRED",
            message="Access forbidden. Administrator privileges are required.",
        )
    return current_user
