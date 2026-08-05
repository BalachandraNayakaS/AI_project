from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session

from app.models.models import Customer


def get_customer_by_id(db: Session, customer_id: int) -> Customer | None:
    return db.get(Customer, customer_id)


def list_customers(db: Session, skip: int = 0, limit: int = 25, search: str | None = None) -> list[Customer]:
    statement = select(Customer)
    if search:
        statement = statement.where(
            Customer.name.ilike(f"%{search}%") | Customer.email.ilike(f"%{search}%")
        )
    statement = statement.offset(skip).limit(limit)
    return db.scalars(statement).all()


def create_customer(db: Session, customer_data: dict) -> Customer:
    customer = Customer(**customer_data)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def update_customer(db: Session, customer_id: int, update_data: dict) -> Customer | None:
    customer = get_customer_by_id(db, customer_id)
    if not customer:
        return None

    for field, value in update_data.items():
        setattr(customer, field, value)

    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer_id: int) -> bool:
    customer = get_customer_by_id(db, customer_id)
    if not customer:
        return False

    db.delete(customer)
    db.commit()
    return True
