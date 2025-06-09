from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update

from app.db import get_async_session
from app.models import Student
from app.schemas import StudentCreate, StudentRead
from app.auth import current_active_admin, current_active_user

router = APIRouter(prefix="/students", tags=["students"])

# Admin-only
@router.post("", response_model=StudentRead, status_code=201)
async def create_student(
    data: StudentCreate,
    session: AsyncSession = Depends(get_async_session),
    _admin=Depends(current_active_admin),
):
    obj = Student(**data.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj

@router.get("", response_model=list[StudentRead])
async def list_students(
    page: int = 1, size: int = 10,
    session: AsyncSession = Depends(get_async_session),
    _admin=Depends(current_active_admin),
):
    q = await session.execute(select(Student).offset((page-1)*size).limit(size))
    return q.scalars().all()

# Student sees/edits own profile
@router.get("/me", response_model=StudentRead)
async def me(
    user=Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    q = await session.execute(select(Student).where(Student.user_id == user.id))
    student = q.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Profile not found")
    return student
