from typing import Any

from app.schemas.schemas import ChatRequest


def generate_chat_response(chat_in: ChatRequest) -> dict[str, Any]:
    # Placeholder for future AI chatbot integration.
    # Replace this logic with a transformer-based model or external AI backend.
    prompt = chat_in.message.strip()
    answer = (
        "I am your AI business copilot. "
        "Send customer questions, sales inquiries, or support requests and I will help you analyze them."
    )
    return {"response": answer, "input": prompt}
