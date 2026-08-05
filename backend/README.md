# AI Business Copilot Backend

This backend implements a scalable FastAPI service for an AI Business Copilot Platform with customer support, sales intelligence, sentiment analysis, lead scoring, recommendations, and reporting.

## Tech Stack

- Python 3.12
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- Alembic
- JWT Authentication
- Celery + Redis
- HuggingFace Transformers / Sentence Transformers
- Pandas, NumPy

## Features

- User registration, login, JWT access and refresh tokens
- Customer CRUD and search
- Sales CRUD and dashboard analytics
- Support ticket tracking
- AI chatbot placeholder endpoint
- Sentiment analysis
- Recommendation generation
- Report generation
- Role-based route authorization

## Quick Start

### 1. Environment

Copy and update the `.env.example` file before running locally:

```bash
cp .env.example .env
```

### 2. Run locally

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Start the app:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open API docs:

- http://localhost:8000/api/docs
- http://localhost:8000/api/redoc

### 3. Run with Docker

Build and start services using Docker Compose:

```bash
docker compose up --build
```

This will create:

- PostgreSQL database on `5432`
- Redis on `6379`
- FastAPI backend on `8000`
- Celery worker for background tasks

## Environment Variables

Key environment variables are defined in `.env.example`:

- `DATABASE_URL`
- `SECRET_KEY`
- `ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `REFRESH_TOKEN_EXPIRE_MINUTES`
- `API_PREFIX`
- `SERVER_HOST`
- `SERVER_PORT`
- `FILE_UPLOAD_DIR`
- `LOG_LEVEL`
- `REDIS_URL`
- `CELERY_BROKER_URL`
- `CELERY_RESULT_BACKEND`

## Project Structure

```text
backend/
├── app/
│   ├── core/
│   ├── crud/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   ├── tasks.py
│   ├── main.py
│   └── uploads/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

## Useful Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/profile`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/sales`
- `POST /api/sales`
- `GET /api/tickets`
- `POST /api/tickets`
- `POST /api/chat`
- `POST /api/sentiment/analyze`
- `GET /api/recommendations`
- `GET /api/analytics/dashboard`
- `POST /api/reports/generate`

## Notes

- Use `admin` role to access protected operations like report generation and ticket status updates.
- The AI chatbot and sentiment analysis use placeholder logic and can be extended with transformer model integration.
