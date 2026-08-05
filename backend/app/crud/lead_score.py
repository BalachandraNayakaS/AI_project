from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import LeadScore


def list_lead_scores(db: Session, skip: int = 0, limit: int = 25) -> list[LeadScore]:
    statement = select(LeadScore).order_by(LeadScore.score.desc()).offset(skip).limit(limit)
    return db.scalars(statement).all()


def count_lead_scores(db: Session) -> int:
    statement = select(func.count()).select_from(LeadScore)
    return int(db.scalar(statement) or 0)


def get_top_lead_scores(db: Session, limit: int = 5) -> list[LeadScore]:
    statement = select(LeadScore).order_by(LeadScore.score.desc()).limit(limit)
    return db.scalars(statement).all()