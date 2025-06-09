from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import Paginated

from app.db import get_async_session
from app.models import Course
from app.schemas import CourseCreate, CourseRead
from app.auth import current_active_admin, current_active_user

router = APIRouter(prefix="/courses", tags=["courses"])


@router.post(
    "", response_model=CourseRead, status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(current_active_admin)]
)
async def create_course(
    data: CourseCreate,
    session: AsyncSession = Depends(get_async_session)
):
    course = Course(**data.model_dump())
    session.add(course)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=409, detail="Course name already exists")
    await session.refresh(course)
    return course


@router.get("", response_model=Paginated[CourseRead], dependencies=[Depends(current_active_user)])
async def list_courses(
    page: int = 1,
    size: int = 10,
    session: AsyncSession = Depends(get_async_session),
):
    total = await session.scalar(select(func.count()).select_from(Course))
    stmt = select(Course).offset((page - 1) * size).limit(size)
    rows = await session.execute(stmt)
    return Paginated[CourseRead](items=rows.scalars().all(), total=total, page=page, size=size)



@router.delete(
    "/{course_id}", status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(current_active_admin)]
)
async def delete_course(
    course_id: UUID,
    session: AsyncSession = Depends(get_async_session)
):
    await session.execute(delete(Course).where(Course.id == course_id))
    await session.commit()
