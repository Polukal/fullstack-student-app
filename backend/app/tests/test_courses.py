import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.models import Course

pytestmark = pytest.mark.asyncio


async def test_create_course(admin_token, async_client: AsyncClient):
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = await async_client.post("/api/courses", json={"name": "Math"}, headers=headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Math"


async def test_unique_name(admin_token, async_client: AsyncClient):
    headers = {"Authorization": f"Bearer {admin_token}"}
    await async_client.post("/api/courses", json={"name": "Physics"}, headers=headers)
    resp = await async_client.post("/api/courses", json={"name": "Physics"}, headers=headers)
    assert resp.status_code == 409
