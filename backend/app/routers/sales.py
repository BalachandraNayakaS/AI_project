from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.schemas import SaleCreate, SaleRead, SaleUpdate
from app.services.sales_service import (
    create_new_sale,
    get_sale,
    get_sales,
    modify_sale,
)

router = APIRouter(prefix="/sales", tags=["sales"])


@router.get("/", response_model=list[SaleRead])
def list_sales(
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    customer_id: int | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return get_sales(db, skip=skip, limit=limit, customer_id=customer_id)


@router.post("/", response_model=SaleRead, status_code=status.HTTP_201_CREATED)
def create_sale(
    sale_in: SaleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return create_new_sale(db, sale_in)


@router.put("/{sale_id}", response_model=SaleRead)
def update_sale(
    sale_id: int,
    sale_in: SaleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    sale = modify_sale(db, sale_id, sale_in)
    if not sale:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sale not found")
    return sale


@router.get("/{sale_id}", response_model=SaleRead)
def retrieve_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    sale = get_sale(db, sale_id)
    if not sale:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sale not found")
    return sale
