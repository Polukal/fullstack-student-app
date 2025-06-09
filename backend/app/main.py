from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.auth import fastapi_users, auth_backend
from app.schemas import UserRead, UserCreate
from app.api import students, courses, enrollments

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Student Course Management API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply limit to JWT login route
async def login_rate_limit(request: Request):
    return

jwt_dependencies = [Depends(limiter.limit("5/minute")(login_rate_limit))]

# ──────────────── CORS ────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────── Auth routes ────────────────
auth_router = fastapi_users.get_auth_router(auth_backend)

# add rate-limit only to the /auth/jwt/login endpoint
for route in auth_router.routes:
    if route.path == "/auth/jwt/login" and route.methods == {"POST"}:
        route.dependant.dependencies.append(
            Depends(limiter.limit("5/minute"))
        )

app.include_router(auth_router, prefix="/auth/jwt", tags=["auth"])
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

# ──────────────── Domain routes ────────────────
app.include_router(students.router, prefix="/api", tags=["students"])
app.include_router(courses.router, prefix="/api", tags=["courses"])
app.include_router(enrollments.router, prefix="/api", tags=["enrollments"])

@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
