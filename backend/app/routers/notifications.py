from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.schemas import NotificationRead

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=List[NotificationRead])
def get_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    notifications = [
        {
            "id": "notif-1",
            "title": "High-Score Lead Generated",
            "message": "AI scored prospect Lead #102 with 94% conversion probability.",
            "type": "lead",
            "category": "Lead Prioritization",
            "read": False,
            "timestamp": "10m ago",
            "link": "/leads",
        },
        {
            "id": "notif-2",
            "title": "New Support Ticket Pending",
            "message": "Customer Apex Global opened an urgent billing inquiry ticket.",
            "type": "ticket",
            "category": "Customer Support",
            "read": False,
            "timestamp": "25m ago",
            "link": "/customers",
        },
        {
            "id": "notif-3",
            "title": "AI Upsell Opportunity",
            "message": "New enterprise add-on recommendation available for TechCorp.",
            "type": "recommendation",
            "category": "AI Insights",
            "read": False,
            "timestamp": "1h ago",
            "link": "/recommendations",
        },
        {
            "id": "notif-4",
            "title": "Monthly Target Achieved",
            "message": "Sales team reached 105% of Q3 revenue benchmark target.",
            "type": "sales",
            "category": "Sales Intelligence",
            "read": True,
            "timestamp": "3h ago",
            "link": "/sales",
        },
        {
            "id": "notif-5",
            "title": "Executive Report Generated",
            "message": "Q3 Revenue & Lead Conversion Analysis PDF report is ready for export.",
            "type": "system",
            "category": "Reports",
            "read": True,
            "timestamp": "5h ago",
            "link": "/reports",
        },
    ]
    return notifications
