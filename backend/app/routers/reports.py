from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.schemas import ReportRead, ReportRequest
from app.services.report_service import generate_report, get_report, get_reports

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/", response_model=list[ReportRead])
def list_all_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return get_reports(db, skip=skip, limit=limit)


@router.post("/generate", response_model=ReportRead, status_code=status.HTTP_201_CREATED)
def create_report(
    report_request: ReportRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    try:
        return generate_report(db, report_request)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.get("/{report_id}/download")
def download_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    report = get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    file_path = Path(report.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report file missing on server")

    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type="text/plain",
    )
