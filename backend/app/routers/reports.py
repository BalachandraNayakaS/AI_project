from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user, get_db, require_role
from app.schemas.schemas import ReportRead, ReportRequest
from app.services.report_service import generate_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/generate", response_model=ReportRead, status_code=status.HTTP_201_CREATED)
def create_report(
    report_request: ReportRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin")),
):
    try:
        return generate_report(db, report_request)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))
