from sqlalchemy.orm import Session

from app.crud.customer import (
    create_customer,
    delete_customer,
    get_customer_by_id,
    list_customers,
    update_customer,
)
from app.schemas.schemas import CustomerCreate, CustomerUpdate


def get_customers(db: Session, skip: int = 0, limit: int = 25, search: str | None = None):
    return list_customers(db, skip=skip, limit=limit, search=search)


def get_customer(db: Session, customer_id: int):
    return get_customer_by_id(db, customer_id)


def create_new_customer(db: Session, customer_in: CustomerCreate):
    customer_data = customer_in.model_dump()
    return create_customer(db, customer_data)


def modify_customer(db: Session, customer_id: int, customer_in: CustomerUpdate):
    update_data = {k: v for k, v in customer_in.model_dump().items() if v is not None}
    return update_customer(db, customer_id, update_data)


def remove_customer(db: Session, customer_id: int):
    return delete_customer(db, customer_id)
