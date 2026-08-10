from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.schemas import RecommendationRead
from app.services.recommendation_service import generate_recommendation, get_recommendations

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("/", response_model=list[RecommendationRead])
def list_recommendations(
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return get_recommendations(db, skip=skip, limit=limit)


@router.post("/generate", response_model=RecommendationRead)
def create_recommendation(
    customer_id: int,
    type: str,
    context: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    try:
        return generate_recommendation(db, customer_id, type, context)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))
