from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import Report


def get_report_by_id(db: Session, report_id: int) -> Report | None:
    return db.get(Report, report_id)


def list_reports(db: Session, skip: int = 0, limit: int = 25) -> list[Report]:
    statement = select(Report).order_by(Report.generated_date.desc()).offset(skip).limit(limit)
    return db.scalars(statement).all()


def create_report(db: Session, report_data: dict) -> Report:
    report = Report(**report_data)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
