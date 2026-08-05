from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import Sale


def get_sale_by_id(db: Session, sale_id: int) -> Sale | None:
    return db.get(Sale, sale_id)


def list_sales(db: Session, skip: int = 0, limit: int = 25, customer_id: int | None = None) -> list[Sale]:
    statement = select(Sale)
    if customer_id is not None:
        statement = statement.where(Sale.customer_id == customer_id)
    statement = statement.offset(skip).limit(limit)
    return db.scalars(statement).all()


def create_sale(db: Session, sale_data: dict) -> Sale:
    sale = Sale(**sale_data)
    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale


def update_sale(db: Session, sale_id: int, update_data: dict) -> Sale | None:
    sale = get_sale_by_id(db, sale_id)
    if not sale:
        return None

    for field, value in update_data.items():
        setattr(sale, field, value)

    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale


def delete_sale(db: Session, sale_id: int) -> bool:
    sale = get_sale_by_id(db, sale_id)
    if not sale:
        return False

    db.delete(sale)
    db.commit()
    return True
