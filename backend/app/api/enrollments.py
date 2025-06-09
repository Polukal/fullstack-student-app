from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_async_session
from app.models import Enrollment, Student, Course
from app.schemas import EnrollmentCreate
from app.auth import current_active_admin, current_active_user

router = APIRouter(prefix="/enrollments", tags=["enrollments"])

async def _student_from_user(user_id: UUID, session: AsyncSession) -> Student:
    q = await session.execute(select(Student).where(Student.user_id == user_id))
    return q.scalar_one_or_none()


@router.post("", status_code=status.HTTP_201_CREATED)
async def enroll(
    data: EnrollmentCreate,
    session: AsyncSession = Depends(get_async_session),
    user=Depends(current_active_user),
):
    # If caller is not admin they can enroll only themselves
    if not user.is_superuser:
        student = await _student_from_user(user.id, session)
        if not student or student.id != data.student_id:
            raise HTTPException(403, "Not allowed to enroll other students")

    enrollment = Enrollment(**data.model_dump())
    session.add(enrollment)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(409, "Student already enrolled in this course")
    return {"message": "enrolled"}


@router.get("/by-student/{student_id}", dependencies=[Depends(current_active_admin)])
async def list_by_student(
    student_id: UUID,
    session: AsyncSession = Depends(get_async_session),
):
    q = await session.execute(
        select(Enrollment).where(Enrollment.student_id == student_id)
    )
    return q.scalars().all()


@router.delete("/{enrollment_id}", status_code=204, dependencies=[Depends(current_active_admin)])
async def drop_enrollment(
    enrollment_id: UUID,
    session: AsyncSession = Depends(get_async_session),
):
    await session.execute(delete(Enrollment).where(Enrollment.id == enrollment_id))
    await session.commit()
