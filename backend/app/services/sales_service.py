from datetime import date
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.crud.sale import create_sale, get_sale_by_id, list_sales, update_sale
from app.schemas.schemas import SaleCreate, SaleUpdate
from app.models.models import Sale


def get_sales(db: Session, skip: int = 0, limit: int = 25, customer_id: int | None = None):
    return list_sales(db, skip=skip, limit=limit, customer_id=customer_id)


def get_sale(db: Session, sale_id: int):
    return get_sale_by_id(db, sale_id)


def create_new_sale(db: Session, sale_in: SaleCreate):
    sale_data = sale_in.model_dump()
    return create_sale(db, sale_data)


def modify_sale(db: Session, sale_id: int, sale_in: SaleUpdate):
    update_data = {k: v for k, v in sale_in.model_dump().items() if v is not None}
    return update_sale(db, sale_id, update_data)


def get_today_sales_total(db: Session) -> float:
    statement = db.query(func.coalesce(func.sum(Sale.amount), 0.0)).filter(func.date(Sale.sales_date) == date.today())
    return float(statement.scalar() or 0.0)
