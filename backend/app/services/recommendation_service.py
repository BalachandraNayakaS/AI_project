from datetime import datetime
from sqlalchemy.orm import Session

from app.crud.recommendation import create_recommendation, list_recommendations
from app.models.models import Customer, Sale, SupportTicket
from app.schemas.schemas import RecommendationRead


def get_recommendations(db: Session, skip: int = 0, limit: int = 25):
    return list_recommendations(db, skip=skip, limit=limit)


def generate_recommendation(db: Session, customer_id: int, type_: str, context: str) -> RecommendationRead:
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise ValueError(f"Customer with ID #{customer_id} does not exist.")

    sales = db.query(Sale).filter(Sale.customer_id == customer_id).all()
    tickets = db.query(SupportTicket).filter(SupportTicket.customer_id == customer_id).all()
    sales_total = sum(s.amount * s.quantity for s in sales)

    recommendation_text = (
        f"AI Strategy for {customer.name} ({customer.company or 'Account'}): "
        f"Based on {len(sales)} total purchases (${sales_total:,.2f}) and {len(tickets)} support tickets, "
        f"recommended {type_} action: \"{context.strip()}\"."
    )
    recommendation = create_recommendation(
        db,
        {
            "customer_id": customer_id,
            "recommendation": recommendation_text,
            "type": type_,
            "created_at": datetime.utcnow(),
        },
    )
    return RecommendationRead.from_orm(recommendation)
