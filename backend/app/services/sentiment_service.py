from typing import Literal
from sqlalchemy.orm import Session

from app.crud.sentiment import create_sentiment
from app.schemas.schemas import SentimentRequest, SentimentResponse


def analyze_sentiment(db: Session, sentiment_in: SentimentRequest) -> SentimentResponse:
    text = sentiment_in.review.strip().lower()
    if not text:
        raise ValueError("Review text is required for sentiment analysis")

    if "good" in text or "great" in text or "excellent" in text:
        sentiment_value = "positive"
        confidence = 0.92
    elif "bad" in text or "poor" in text or "negative" in text:
        sentiment_value = "negative"
        confidence = 0.88
    else:
        sentiment_value = "neutral"
        confidence = 0.76

    sentiment_record = create_sentiment(
        db,
        {
            "customer_id": 0,
            "review": sentiment_in.review,
            "sentiment": sentiment_value,
            "confidence": confidence,
        },
    )

    return SentimentResponse(sentiment=sentiment_record.sentiment, confidence=sentiment_record.confidence)
