from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.security import create_access_token, get_password_hash, verify_password
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserRegisterRequest, UserResponse


class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def register_customer(self, request: UserRegisterRequest) -> UserResponse:
        # Check if email is already registered
        existing_user = self.user_repo.get_by_email(request.email)
        if existing_user:
            raise AppException(
                status_code=409,
                code="EMAIL_ALREADY_EXISTS",
                message="An account with this email address already exists.",
            )

        # Hash password and create customer user (role is ALWAYS customer)
        hashed_password = get_password_hash(request.password)
        user = self.user_repo.create(
            full_name=request.full_name,
            email=request.email,
            password_hash=hashed_password,
            role="customer",
        )
        return UserResponse.model_validate(user)

    def authenticate_user(self, request: LoginRequest) -> TokenResponse:
        user = self.user_repo.get_by_email(request.email)
        if not user or not verify_password(request.password, user.password_hash):
            raise AppException(
                status_code=401,
                code="INVALID_CREDENTIALS",
                message="Invalid email or password.",
            )

        if not user.is_active:
            raise AppException(
                status_code=403,
                code="ACCOUNT_INACTIVE",
                message="Your account is currently inactive.",
            )

        # Create JWT Access Token
        token_payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }
        access_token = create_access_token(data=token_payload)

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )
