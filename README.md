# Fullstack Student–Course Management App

This scaffold gives you a **FastAPI + PostgreSQL** backend and a **React + Vite + TypeScript**
frontend, wired up with **Docker Compose**.

## Prerequisites

* Docker & Docker Compose plugin
* (Optional) Node ≥ 20+ and Python ≥ 3.11 locally for dev without Docker

## Run everything

```bash
docker compose up --build
```

* Backend API → http://localhost:8000/docs  
* Frontend UI → http://localhost:3000  
* Postgres exposed on `localhost:5432` (user/password: `postgres`)

## Local development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Next steps

1. Implement auth with `fastapi-users` (JWT) and connect to Postgres.
2. Create SQLAlchemy models for **User**, **Student**, **Course**, **Enrollment**.
3. Add CRUD routers with FastAPI.
4. Use Redux Toolkit Query on the React side to talk to the API.
# fullstack-student-app
