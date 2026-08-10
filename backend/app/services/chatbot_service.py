from typing import Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.schemas.schemas import ChatRequest
from app.models.models import Customer, Sale, SupportTicket, LeadScore, Sentiment, Recommendation, ChatMessage


def generate_chat_response(chat_in: ChatRequest, db: Optional[Session] = None) -> dict[str, Any]:
    prompt = chat_in.message.strip()
    prompt_lower = prompt.lower()

    if db is None:
        return {
            "response": "AI Copilot connected. Database context is currently unavailable.",
            "input": prompt,
        }

    # 1. Check for Customer Specific Queries
    customers = db.query(Customer).all()
    matched_customer = None
    for c in customers:
        if c.name.lower() in prompt_lower or (c.company and c.company.lower() in prompt_lower):
            matched_customer = c
            break

    if matched_customer:
        sales = db.query(Sale).filter(Sale.customer_id == matched_customer.id).all()
        tickets = db.query(SupportTicket).filter(SupportTicket.customer_id == matched_customer.id).all()
        leads = db.query(LeadScore).filter(LeadScore.customer_id == matched_customer.id).all()

        sales_total = sum(s.amount * s.quantity for s in sales)
        open_tickets = [t for t in tickets if t.status == 'open']
        lead_info = f"Score: {leads[0].score}/100 ({leads[0].recommended_action})" if leads else "Not Scored"

        response = (
            f"👤 **Customer Profile: {matched_customer.name}**\n"
            f"• Company: {matched_customer.company or 'N/A'} ({matched_customer.city or ''}, {matched_customer.country or ''})\n"
            f"• Email: {matched_customer.email}\n"
            f"• Total Sales Volume: ${sales_total:,.2f} ({len(sales)} transactions)\n"
            f"• Open Support Tickets: {len(open_tickets)} of {len(tickets)} total\n"
            f"• Lead Intelligence: {lead_info}\n\n"
            f"💡 *Recommendation*: Maintain proactive communication to drive retention and upsell opportunities."
        )
        return {"response": response, "input": prompt}

    # 2. Sales Opportunity Summary / Revenue
    if any(k in prompt_lower for k in ["sale", "revenue", "opportunity", "product", "deal", "income", "money"]):
        total_revenue = db.query(func.sum(Sale.amount * Sale.quantity)).scalar() or 0.0
        total_sales_count = db.query(Sale).count()
        avg_deal = (total_revenue / total_sales_count) if total_sales_count > 0 else 0.0

        top_sales = db.query(Sale).order_by((Sale.amount * Sale.quantity).desc()).limit(3).all()
        top_items = []
        for s in top_sales:
            cust_name = s.customer.name if s.customer else f"Customer #{s.customer_id}"
            top_items.append(f"  - {s.product} (${s.amount * s.quantity:,.2f} for {cust_name})")

        top_str = "\n".join(top_items) if top_items else "  - No recent sales recorded."

        response = (
            f"📊 **Sales Opportunity & Revenue Summary**\n\n"
            f"• **Total Recorded Revenue**: ${total_revenue:,.2f}\n"
            f"• **Completed Transactions**: {total_sales_count}\n"
            f"• **Average Deal Size**: ${avg_deal:,.2f}\n\n"
            f"🏆 **Top Sales Deals**:\n{top_str}\n\n"
            f"💡 *AI Action*: Target existing active accounts with upsell recommendations to increase average deal size."
        )
        return {"response": response, "input": prompt}

    # 3. Support Ticket Analysis / Conversation Summaries
    if any(k in prompt_lower for k in ["ticket", "support", "issue", "conversation", "summarize", "helpdesk", "complaint"]):
        total_tickets = db.query(SupportTicket).count()
        open_tickets = db.query(SupportTicket).filter(SupportTicket.status == "open").all()
        high_priority = [t for t in open_tickets if t.priority == "high"]

        ticket_list = []
        for t in open_tickets[:3]:
            cust_name = t.customer.name if t.customer else f"Customer #{t.customer_id}"
            ticket_list.append(f"  - [{t.priority.upper()}] {t.subject} ({cust_name})")

        ticket_str = "\n".join(ticket_list) if ticket_list else "  - No open support tickets!"

        response = (
            f"🛠️ **Support Ticket & Conversation Analysis**\n\n"
            f"• **Total Tickets Tracked**: {total_tickets}\n"
            f"• **Active Open Tickets**: {len(open_tickets)}\n"
            f"• **High Priority Issues**: {len(high_priority)}\n\n"
            f"⚠️ **Recent Open Issues**:\n{ticket_str}\n\n"
            f"💡 *AI Resolution*: Escalate High-Priority tickets to support leads to keep customer satisfaction optimal."
        )
        return {"response": response, "input": prompt}

    # 4. Lead Prioritization / Lead Scoring
    if any(k in prompt_lower for k in ["lead", "priorit", "score", "prospect", "qualified"]):
        leads = db.query(LeadScore).order_by(LeadScore.score.desc()).limit(5).all()
        lead_items = []
        for l in leads:
            cust_name = l.customer.name if l.customer else f"Customer #{l.customer_id}"
            lead_items.append(
                f"  - **{cust_name}**: Score {l.score}/100 (Prob: {int(l.probability*100)}%) — *{l.recommended_action}*"
            )

        leads_str = "\n".join(lead_items) if lead_items else "  - No lead scores calculated yet."

        response = (
            f"🎯 **Lead Prioritization Matrix**\n\n"
            f"Here are top priority accounts ranked by AI Lead Intelligence:\n\n"
            f"{leads_str}\n\n"
            f"💡 *AI Strategy*: Focus sales outreach on high probability prospects (>75%) for maximum conversion efficiency."
        )
        return {"response": response, "input": prompt}

    # 5. Recommendation / Insights
    if any(k in prompt_lower for k in ["recommend", "insight", "growth", "next step", "upsell"]):
        recs = db.query(Recommendation).order_by(Recommendation.created_at.desc()).limit(4).all()
        rec_items = []
        for r in recs:
            cust_name = r.customer.name if r.customer else f"Customer #{r.customer_id}"
            rec_items.append(f"  - **{cust_name}** [{r.type.upper()}]: {r.recommendation}")

        rec_str = "\n".join(rec_items) if rec_items else "  - Run recommendation engine on customer accounts to generate insights."

        response = (
            f"💡 **AI Recommendation Insights**\n\n"
            f"Recent automated growth and upsell recommendations:\n\n"
            f"{rec_str}"
        )
        return {"response": response, "input": prompt}

    # 6. General / Default Assistant Greeting & Overview
    total_customers = db.query(Customer).count()
    total_sales = db.query(Sale).count()
    total_tickets = db.query(SupportTicket).count()
    total_revenue = db.query(func.sum(Sale.amount * Sale.quantity)).scalar() or 0.0

    response = (
        f"🤖 **AI Business Copilot**\n\n"
        f"I analyzed your request: *\"{prompt}\"*\n\n"
        f"📈 **Live Business Status**:\n"
        f"• **Customers**: {total_customers} active accounts\n"
        f"• **Revenue**: ${total_revenue:,.2f} across {total_sales} sales\n"
        f"• **Support Tickets**: {total_tickets} logged issues\n\n"
        f"💡 **Things you can ask me**:\n"
        f"1. *\"Sales opportunity summary\"* — Breakdown of sales volume & top deals\n"
        f"2. *\"Support ticket analysis\"* — Active issues and priority breakdown\n"
        f"3. *\"Lead prioritization\"* — AI scored leads and high-conversion prospects\n"
        f"4. Ask about specific companies (e.g. *\"Globex Corporation\"*, *\"Initech\"*)"
    )
    return {"response": response, "input": prompt}
