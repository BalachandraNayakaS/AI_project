from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user, get_db, require_role
from app.schemas.schemas import CustomerCreate, CustomerRead, CustomerUpdate
from app.services.customer_service import (
    create_new_customer,
    get_customer,
    get_customers,
    modify_customer,
    remove_customer,
)

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("/", response_model=list[CustomerRead])
def list_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    search: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return get_customers(db, skip=skip, limit=limit, search=search)


@router.post("/", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
def create_customer(
    customer_in: CustomerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return create_new_customer(db, customer_in)


@router.put("/{customer_id}", response_model=CustomerRead)
def update_customer(
    customer_id: int,
    customer_in: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    customer = modify_customer(db, customer_id, customer_in)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin")),
):
    success = remove_customer(db, customer_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return None
