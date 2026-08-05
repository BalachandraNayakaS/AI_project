from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.schemas import DashboardResponse
from app.services.analytics_service import get_dashboard_metrics

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return get_dashboard_metrics(db)
