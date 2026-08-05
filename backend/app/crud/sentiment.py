from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import Sentiment


def get_sentiment_by_id(db: Session, sentiment_id: int) -> Sentiment | None:
    return db.get(Sentiment, sentiment_id)


def list_sentiments(db: Session, skip: int = 0, limit: int = 25) -> list[Sentiment]:
    statement = select(Sentiment).offset(skip).limit(limit)
    return db.scalars(statement).all()


def create_sentiment(db: Session, sentiment_data: dict) -> Sentiment:
    sentiment = Sentiment(**sentiment_data)
    db.add(sentiment)
    db.commit()
    db.refresh(sentiment)
    return sentiment
