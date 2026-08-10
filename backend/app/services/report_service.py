from datetime import datetime
from pathlib import Path
from typing import Optional
from sqlalchemy import func

from app.core.config import settings
from app.crud.report import create_report, get_report_by_id, list_reports
from app.models.models import Customer, Sale, SupportTicket, LeadScore
from app.schemas.schemas import ReportRead, ReportRequest


def get_reports(db, skip: int = 0, limit: int = 25):
    return list_reports(db, skip=skip, limit=limit)


def get_report(db, report_id: int):
    return get_report_by_id(db, report_id)


def generate_report(db, report_request: ReportRequest) -> ReportRead:
    report_dir = settings.FILE_UPLOAD_DIR
    report_dir.mkdir(parents=True, exist_ok=True)

    # Query Live DB Metrics for the Report
    total_customers = db.query(Customer).count()
    total_sales_count = db.query(Sale).count()
    total_revenue = db.query(func.sum(Sale.amount * Sale.quantity)).scalar() or 0.0
    total_tickets = db.query(SupportTicket).count()
    open_tickets = db.query(SupportTicket).filter(SupportTicket.status == "open").count()
    top_leads = db.query(LeadScore).order_by(LeadScore.score.desc()).limit(3).all()

    lead_lines = []
    for l in top_leads:
        cust_name = l.customer.name if l.customer else f"Customer #{l.customer_id}"
        lead_lines.append(f"  - {cust_name}: Score {l.score}/100 ({l.recommended_action})")

    lead_text = "\n".join(lead_lines) if lead_lines else "  - No active lead scores recorded."

    file_name = f"report_{report_request.report_type}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.txt"
    file_path = report_dir / file_name
    report_contents = [
        "==================================================",
        f"        AI BUSINESS COPILOT EXECUTIVE REPORT      ",
        "==================================================",
        f"Title:        {report_request.title}",
        f"Report Type:  {report_request.report_type.upper()}",
        f"Generated At: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}",
        f"Date Range:   {report_request.start_date or 'N/A'} to {report_request.end_date or 'N/A'}",
        "--------------------------------------------------",
        "               EXECUTIVE SUMMARY METRICS          ",
        "--------------------------------------------------",
        f"• Total Customer Accounts:    {total_customers}",
        f"• Total Recorded Revenue:     ${total_revenue:,.2f}",
        f"• Completed Sales Orders:     {total_sales_count}",
        f"• Total Support Tickets:      {total_tickets} ({open_tickets} Active Open)",
        "--------------------------------------------------",
        "               TOP PRIORITIZED LEADS              ",
        "--------------------------------------------------",
        lead_text,
        "==================================================",
        "Report compiled automatically by AI Business Copilot Engine.",
    ]

    file_path.write_text("\n".join(report_contents), encoding="utf-8")

    report_record = create_report(
        db,
        {
            "title": report_request.title,
            "report_type": report_request.report_type,
            "generated_date": datetime.utcnow(),
            "file_path": str(file_path),
        },
    )
    return ReportRead.from_orm(report_record)
