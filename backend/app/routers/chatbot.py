from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.chatbot_service import generate_chat_response

router = APIRouter(prefix="/chat", tags=["chatbot"])


@router.post("/", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    response = generate_chat_response(payload)
    return {"response": response["response"]}
