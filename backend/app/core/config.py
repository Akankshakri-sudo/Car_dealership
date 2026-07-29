from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "AutoApex Dealership System"
    APP_ENV: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str = (
        "postgresql+psycopg://postgres:postgres@localhost:5432/car_dealership"
    )
    TEST_DATABASE_URL: str = (
        "postgresql+psycopg://postgres:postgres@localhost:5432/car_dealership_test"
    )

    JWT_SECRET_KEY: str = "replace-with-a-secure-random-64-character-hex-string"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
