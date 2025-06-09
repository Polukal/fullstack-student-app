from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import fastapi_users, auth_backend
from app.schemas import UserRead, UserCreate
from app.api import students, courses, enrollments

app = FastAPI(
    title="Student Course Management API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(students.router, prefix="/api", tags=["students"])
app.include_router(courses.router, prefix="/api", tags=["courses"])
app.include_router(enrollments.router, prefix="/api", tags=["enrollments"])

@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
