from typing import Any

from app.core.celery_app import celery
from app.core.database import SessionLocal
from app.schemas.schemas import ReportRequest
from app.services.report_service import generate_report


@celery.task(name="generate_report_task")
def generate_report_task(report_data: dict[str, Any]) -> dict[str, Any]:
    db = SessionLocal()
    try:
        report_request = ReportRequest.model_validate(report_data)
        report = generate_report(db, report_request)
        return report.model_dump()
    finally:
        db.close()
