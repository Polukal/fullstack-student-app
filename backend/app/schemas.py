from datetime import date
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr

### —— auth ——
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    is_admin: bool = False

class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str | None
    is_admin: bool

### —— students / courses ——
class StudentBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date = Field(..., lt=date.today())   # cannot be in future

class StudentCreate(StudentBase):
    user_id: UUID

class StudentRead(StudentBase):
    id: UUID
    user_id: UUID

class CourseBase(BaseModel):
    name: str

class CourseCreate(CourseBase): ...
class CourseRead(CourseBase):
    id: UUID

class EnrollmentCreate(BaseModel):
    student_id: UUID
    course_id: UUID
