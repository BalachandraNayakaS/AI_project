from datetime import datetime
from sqlalchemy.orm import Session

from app.crud.recommendation import create_recommendation, list_recommendations
from app.schemas.schemas import RecommendationRead


def get_recommendations(db: Session, skip: int = 0, limit: int = 25):
    return list_recommendations(db, skip=skip, limit=limit)


def generate_recommendation(db: Session, customer_id: int, type_: str, context: str) -> RecommendationRead:
    recommendation_text = (
        f"Based on customer activity and support signals, recommend next steps for customer {customer_id}."
    )
    recommendation = create_recommendation(
        db,
        {
            "customer_id": customer_id,
            "recommendation": recommendation_text,
            "type": type_,
            "created_at": datetime.utcnow(),
        },
    )
    return RecommendationRead.from_orm(recommendation)
