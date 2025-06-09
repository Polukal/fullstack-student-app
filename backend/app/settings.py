from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/school"
    SECRET: str = "CHANGE_ME_SUPER_SECRET"
    # seed admin
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: str = "ChangeMe123!"

settings = Settings()
