from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.schemas import SentimentRequest, SentimentResponse
from app.services.sentiment_service import analyze_sentiment

router = APIRouter(prefix="/sentiment", tags=["sentiment"])


@router.post("/analyze", response_model=SentimentResponse)
def analyze(
    sentiment_in: SentimentRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    try:
        return analyze_sentiment(db, sentiment_in)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
