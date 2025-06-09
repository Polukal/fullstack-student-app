import uuid, os, asyncio
from fastapi import FastAPI
from fastapi_users.password import PasswordHelper

from app.models import User
from app.db import async_session
from app.settings import settings

pwd_ctx = PasswordHelper()

async def create_admin() -> None:
    async with async_session() as session:
        exists = await session.scalar(
            select(User).where(User.email == settings.ADMIN_EMAIL)
        )
        if exists:
            return
        user = User(
            id=uuid.uuid4(),
            email=settings.ADMIN_EMAIL,
            hashed_password=pwd_ctx.hash(settings.ADMIN_PASSWORD),
            is_superuser=True,
            is_active=True,
            is_verified=True,
            full_name="Admin",
        )
        session.add(user)
        await session.commit()

def register_startup_event(app: FastAPI) -> None:
    @app.on_event("startup")
    async def _seed() -> None:           # noqa: WPS430
        await create_admin()
