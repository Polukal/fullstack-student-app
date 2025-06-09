import pytest, asyncio, uuid
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.db import async_session
from app.models import User
from app.auth import fastapi_users

@pytest.fixture
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as c:
        yield c

@pytest.fixture
async def admin_token(async_client):
    # register admin, login and return JWT (pseudo-code)
    email = f"admin_{uuid.uuid4()}@x.com"
    await async_client.post("/auth/register", json={
        "email": email, "password": "pass", "is_admin": True
    })
    resp = await async_client.post("/auth/jwt/login", data={
        "username": email, "password": "pass"
    })
    return resp.json()["access_token"]
