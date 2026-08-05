# AI_project

DATABASE_URL=postgresql+psycopg[binary]://postgres:password@localhost:5432/ai_business
SECRET_KEY=replace-this-with-a-strong-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_MINUTES=1440

API_PREFIX=/api
SERVER_HOST=0.0.0.0
SERVER_PORT=8000

FILE_UPLOAD_DIR=./app/uploads
LOG_LEVEL=INFO

REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2