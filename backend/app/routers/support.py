from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user, get_db, require_role
from app.schemas.schemas import SupportTicketCreate, SupportTicketRead, SupportTicketUpdate
from app.services.support_service import (
    create_new_ticket,
    get_ticket,
    get_tickets,
    modify_ticket,
)

router = APIRouter(prefix="/tickets", tags=["support"])


@router.get("/", response_model=list[SupportTicketRead])
def list_tickets(
    skip: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return get_tickets(db, skip=skip, limit=limit)


@router.post("/", response_model=SupportTicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_in: SupportTicketCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return create_new_ticket(db, ticket_in)


@router.put("/{ticket_id}", response_model=SupportTicketRead)
def update_ticket(
    ticket_id: int,
    ticket_in: SupportTicketUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin")),
):
    ticket = modify_ticket(db, ticket_id, ticket_in)
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return ticket


@router.get("/{ticket_id}", response_model=SupportTicketRead)
def retrieve_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    ticket = get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return ticket
