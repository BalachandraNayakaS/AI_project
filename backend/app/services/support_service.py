from sqlalchemy.orm import Session

from app.crud.support_ticket import (
    create_ticket,
    delete_ticket,
    get_ticket_by_id,
    list_tickets,
    update_ticket,
)
from app.schemas.schemas import SupportTicketCreate, SupportTicketUpdate


def get_tickets(db: Session, skip: int = 0, limit: int = 25):
    return list_tickets(db, skip=skip, limit=limit)


def get_ticket(db: Session, ticket_id: int):
    return get_ticket_by_id(db, ticket_id)


def create_new_ticket(db: Session, ticket_in: SupportTicketCreate):
    ticket_data = ticket_in.model_dump()
    return create_ticket(db, ticket_data)


def modify_ticket(db: Session, ticket_id: int, ticket_in: SupportTicketUpdate):
    update_data = {k: v for k, v in ticket_in.model_dump().items() if v is not None}
    return update_ticket(db, ticket_id, update_data)


def remove_ticket(db: Session, ticket_id: int):
    return delete_ticket(db, ticket_id)
