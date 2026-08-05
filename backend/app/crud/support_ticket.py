from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.models import SupportTicket


def get_ticket_by_id(db: Session, ticket_id: int) -> SupportTicket | None:
    return db.get(SupportTicket, ticket_id)


def list_tickets(db: Session, skip: int = 0, limit: int = 25) -> list[SupportTicket]:
    statement = select(SupportTicket).offset(skip).limit(limit)
    return db.scalars(statement).all()


def create_ticket(db: Session, ticket_data: dict) -> SupportTicket:
    ticket = SupportTicket(**ticket_data)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def update_ticket(db: Session, ticket_id: int, update_data: dict) -> SupportTicket | None:
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        return None

    for field, value in update_data.items():
        setattr(ticket, field, value)

    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def delete_ticket(db: Session, ticket_id: int) -> bool:
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        return False

    db.delete(ticket)
    db.commit()
    return True
