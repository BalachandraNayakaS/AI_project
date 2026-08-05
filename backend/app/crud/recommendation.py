from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import Recommendation


def get_recommendation_by_id(db: Session, recommendation_id: int) -> Recommendation | None:
    return db.get(Recommendation, recommendation_id)


def list_recommendations(db: Session, skip: int = 0, limit: int = 25) -> list[Recommendation]:
    statement = select(Recommendation).offset(skip).limit(limit)
    return db.scalars(statement).all()


def create_recommendation(db: Session, recommendation_data: dict) -> Recommendation:
    recommendation = Recommendation(**recommendation_data)
    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)
    return recommendation
