"""
Comprehensive Demo Test Suite for AI Business Copilot Backend
Tests all 11 backend subsystems, endpoints, authentication, CRUD, and AI features.
"""

import sys
import os
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import create_app
from app.core.database import Base, engine, SessionLocal
from app.models.models import User, Customer, Sale, SupportTicket, LeadScore, Sentiment, Recommendation

# Initialize app and test client
app = create_app()
client = TestClient(app)

# Track test results
test_results = []

def record_result(module: str, endpoint: str, method: str, status_code: int, expected: int, passed: bool, details: str = ""):
    test_results.append({
        "module": module,
        "endpoint": endpoint,
        "method": method,
        "status_code": status_code,
        "expected": expected,
        "passed": passed,
        "details": details
    })
    mark = " [PASS] " if passed else " [FAIL] "
    print(f"{mark} {method:6} {endpoint:35} -> {status_code} ({details})")

def run_all_tests():
    print("=" * 80)
    print("       AI BUSINESS COPILOT - COMPLETE BACKEND DEMO TEST SUITE")
    print("=" * 80)

    # 1. Ensure DB schema exists
    Base.metadata.create_all(bind=engine)

    # ----------------------------------------------------
    # Module 1: Root & Health Check Endpoints
    # ----------------------------------------------------
    print("\n--- 1. Testing Core & Health Endpoints ---")
    r = client.get("/")
    record_result("Core", "/", "GET", r.status_code, 200, r.status_code == 200, r.json().get("message", ""))

    r = client.get("/health")
    record_result("Core", "/health", "GET", r.status_code, 200, r.status_code == 200, f"Status: {r.json().get('status')}")

    # ----------------------------------------------------
    # Module 2: Authentication & Authorization (User & Admin)
    # ----------------------------------------------------
    print("\n--- 2. Testing Authentication & User Management ---")
    # Register regular user
    reg_user_payload = {
        "username": "demouser_standard",
        "email": "demouser@example.com",
        "password": "DemoPassword123!",
        "role": "user"
    }
    r = client.post("/api/auth/register", json=reg_user_payload)
    # 201 or 400 if already exists
    if r.status_code == 201:
        record_result("Auth", "/api/auth/register", "POST", r.status_code, 201, True, "Standard user registered")
    elif r.status_code == 400 and "already" in r.text.lower():
        record_result("Auth", "/api/auth/register", "POST", r.status_code, 200, True, "Standard user already exists (idempotent)")
    else:
        record_result("Auth", "/api/auth/register", "POST", r.status_code, 201, False, r.text)

    # Register admin user
    reg_admin_payload = {
        "username": "demouser_admin",
        "email": "demoadmin@example.com",
        "password": "AdminPassword123!",
        "role": "admin"
    }
    r = client.post("/api/auth/register", json=reg_admin_payload)
    if r.status_code == 201:
        record_result("Auth", "/api/auth/register (admin)", "POST", r.status_code, 201, True, "Admin user registered")
    elif r.status_code == 400 and "already" in r.text.lower():
        record_result("Auth", "/api/auth/register (admin)", "POST", r.status_code, 200, True, "Admin user exists (idempotent)")
    else:
        record_result("Auth", "/api/auth/register (admin)", "POST", r.status_code, 201, False, r.text)

    # Login standard user
    login_resp = client.post("/api/auth/login", json={"username": "demouser_standard", "password": "DemoPassword123!"})
    user_token = login_resp.json().get("access_token", "") if login_resp.status_code == 200 else ""
    record_result("Auth", "/api/auth/login (user)", "POST", login_resp.status_code, 200, login_resp.status_code == 200, f"Token generated ({len(user_token)} chars)")

    # Login admin user
    admin_resp = client.post("/api/auth/login", json={"username": "demouser_admin", "password": "AdminPassword123!"})
    admin_token = admin_resp.json().get("access_token", "") if admin_resp.status_code == 200 else ""
    record_result("Auth", "/api/auth/login (admin)", "POST", admin_resp.status_code, 200, admin_resp.status_code == 200, f"Admin token generated")

    user_headers = {"Authorization": f"Bearer {user_token}"}
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Profile check
    r = client.get("/api/auth/profile", headers=user_headers)
    record_result("Auth", "/api/auth/profile", "GET", r.status_code, 200, r.status_code == 200, f"User: {r.json().get('username')}, Role: {r.json().get('role')}")

    # Refresh token
    r = client.post("/api/auth/refresh", headers=user_headers)
    record_result("Auth", "/api/auth/refresh", "POST", r.status_code, 200, r.status_code == 200, "Token refreshed successfully")

    # ----------------------------------------------------
    # Module 3: Customer Management CRUD
    # ----------------------------------------------------
    print("\n--- 3. Testing Customer Management CRUD ---")
    customer_payload = {
        "name": "Acme Innovations Ltd",
        "email": "contact@acmeinnovations.example",
        "phone": "+1-555-4567",
        "company": "Acme Innovations",
        "city": "San Francisco",
        "country": "USA",
        "status": "active"
    }
    r = client.post("/api/customers/", json=customer_payload, headers=user_headers)
    customer_data = r.json() if r.status_code == 201 else {}
    customer_id = customer_data.get("id", 1)
    record_result("Customers", "/api/customers/", "POST", r.status_code, 201, r.status_code == 201, f"Created customer id={customer_id}")

    # List customers
    r = client.get("/api/customers/?limit=10", headers=user_headers)
    cust_list = r.json() if r.status_code == 200 else []
    record_result("Customers", "/api/customers/", "GET", r.status_code, 200, r.status_code == 200, f"Retrieved {len(cust_list)} customers")

    # Update customer
    update_payload = {"city": "San Jose", "status": "active"}
    r = client.put(f"/api/customers/{customer_id}", json=update_payload, headers=user_headers)
    record_result("Customers", f"/api/customers/{customer_id}", "PUT", r.status_code, 200, r.status_code == 200, f"Updated city to {r.json().get('city')}")

    # ----------------------------------------------------
    # Module 4: Sales Tracking & Deals
    # ----------------------------------------------------
    print("\n--- 4. Testing Sales Tracking & Deals ---")
    sale_payload = {
        "customer_id": customer_id,
        "product": "Enterprise AI Copilot Tier",
        "amount": 4999.00,
        "quantity": 1
    }
    r = client.post("/api/sales/", json=sale_payload, headers=user_headers)
    sale_data = r.json() if r.status_code == 201 else {}
    sale_id = sale_data.get("id", 1)
    record_result("Sales", "/api/sales/", "POST", r.status_code, 201, r.status_code == 201, f"Recorded sale id={sale_id}, amount=${sale_data.get('amount')}")

    # List sales
    r = client.get("/api/sales/", headers=user_headers)
    sales_list = r.json() if r.status_code == 200 else []
    record_result("Sales", "/api/sales/", "GET", r.status_code, 200, r.status_code == 200, f"Retrieved {len(sales_list)} sales records")

    # Retrieve single sale
    r = client.get(f"/api/sales/{sale_id}", headers=user_headers)
    record_result("Sales", f"/api/sales/{sale_id}", "GET", r.status_code, 200, r.status_code == 200, f"Product: {r.json().get('product')}")

    # Update sale
    r = client.put(f"/api/sales/{sale_id}", json={"quantity": 2}, headers=user_headers)
    record_result("Sales", f"/api/sales/{sale_id}", "PUT", r.status_code, 200, r.status_code == 200, f"Updated quantity to {r.json().get('quantity')}")

    # ----------------------------------------------------
    # Module 5: Customer Support Tickets
    # ----------------------------------------------------
    print("\n--- 5. Testing Customer Support Tickets ---")
    ticket_payload = {
        "customer_id": customer_id,
        "subject": "API Integration Assistance",
        "message": "Need help setting up automated webhooks for copilot events.",
        "priority": "high"
    }
    r = client.post("/api/tickets/", json=ticket_payload, headers=user_headers)
    ticket_data = r.json() if r.status_code == 201 else {}
    ticket_id = ticket_data.get("id", 1)
    record_result("Support", "/api/tickets/", "POST", r.status_code, 201, r.status_code == 201, f"Created ticket id={ticket_id}, priority={ticket_data.get('priority')}")

    # List tickets
    r = client.get("/api/tickets/", headers=user_headers)
    record_result("Support", "/api/tickets/", "GET", r.status_code, 200, r.status_code == 200, f"Retrieved {len(r.json())} tickets")

    # Retrieve ticket
    r = client.get(f"/api/tickets/{ticket_id}", headers=user_headers)
    record_result("Support", f"/api/tickets/{ticket_id}", "GET", r.status_code, 200, r.status_code == 200, f"Subject: {r.json().get('subject')}")

    # Admin update ticket status
    r = client.put(f"/api/tickets/{ticket_id}", json={"status": "resolved"}, headers=admin_headers)
    record_result("Support", f"/api/tickets/{ticket_id} (admin)", "PUT", r.status_code, 200, r.status_code == 200, f"Status updated to {r.json().get('status')}")

    # ----------------------------------------------------
    # Module 6: Analytics Dashboard
    # ----------------------------------------------------
    print("\n--- 6. Testing Analytics Dashboard ---")
    r = client.get("/api/analytics/dashboard", headers=user_headers)
    dash = r.json() if r.status_code == 200 else {}
    has_keys = all(k in dash for k in ["customers", "today_sales", "tickets", "lead_conversion", "lead_scores"])
    record_result("Analytics", "/api/analytics/dashboard", "GET", r.status_code, 200, r.status_code == 200 and has_keys, f"Customers: {dash.get('customers', 0)}, Today Sales: ${dash.get('today_sales', 0):,.2f}, Tickets: {dash.get('tickets', 0)}")


    # ----------------------------------------------------
    # Module 7: AI Chatbot Assistant
    # ----------------------------------------------------
    print("\n--- 7. Testing AI Chatbot Assistant ---")
    # Test 1: General prompt
    r = client.post("/api/chat/", json={"message": "What is the status of our sales and pipeline?"}, headers=user_headers)
    chat_resp = r.json() if r.status_code == 200 else {}
    record_result("AI Chatbot", "/api/chat/ (Sales Query)", "POST", r.status_code, 200, r.status_code == 200 and len(chat_resp.get("response", "")) > 0, "Generated intelligent sales response")

    # Test 2: Support ticket summary prompt
    r = client.post("/api/chat/", json={"message": "Summarize support tickets and high priority issues"}, headers=user_headers)
    record_result("AI Chatbot", "/api/chat/ (Support Query)", "POST", r.status_code, 200, r.status_code == 200, "Generated support summary")

    # Test 3: Lead prioritization prompt
    r = client.post("/api/chat/", json={"message": "Lead prioritization and top scored prospects"}, headers=user_headers)
    record_result("AI Chatbot", "/api/chat/ (Leads Query)", "POST", r.status_code, 200, r.status_code == 200, "Generated lead prioritization matrix")

    # ----------------------------------------------------
    # Module 8: Sentiment Analysis
    # ----------------------------------------------------
    print("\n--- 8. Testing Sentiment Analysis ---")
    sentiment_payload = {
        "customer_id": customer_id,
        "review": "The AI Copilot platform drastically improved our workflow efficiency and customer response speed!"
    }
    r = client.post("/api/sentiment/analyze", json=sentiment_payload, headers=user_headers)
    sent_data = r.json() if r.status_code == 200 else {}
    record_result("AI Sentiment", "/api/sentiment/analyze", "POST", r.status_code, 200, r.status_code == 200, f"Classified as '{sent_data.get('sentiment')}' (confidence: {sent_data.get('confidence', 0)*100:.1f}%)")

    # ----------------------------------------------------
    # Module 9: AI Recommendations
    # ----------------------------------------------------
    print("\n--- 9. Testing AI Recommendations ---")
    r = client.post(f"/api/recommendations/generate?customer_id={customer_id}&type=upsell&context=High+usage+and+positive+sentiment", headers=user_headers)
    rec_data = r.json() if r.status_code == 200 else {}
    record_result("Recommendations", "/api/recommendations/generate", "POST", r.status_code, 200, r.status_code == 200, f"Generated: {rec_data.get('recommendation', '')[:60]}...")

    r = client.get("/api/recommendations/", headers=user_headers)
    record_result("Recommendations", "/api/recommendations/", "GET", r.status_code, 200, r.status_code == 200, f"Retrieved {len(r.json())} recommendations")

    # ----------------------------------------------------
    # Module 10: Reports Generation & Download
    # ----------------------------------------------------
    print("\n--- 10. Testing Reports Engine ---")
    report_req = {
        "title": "Q3 Executive Performance & AI Intelligence Report",
        "report_type": "sales"
    }
    r = client.post("/api/reports/generate", json=report_req, headers=user_headers)
    rep_data = r.json() if r.status_code == 201 else {}
    report_id = rep_data.get("id", 1)
    record_result("Reports", "/api/reports/generate", "POST", r.status_code, 201, r.status_code == 201, f"Generated Report #{report_id} ({rep_data.get('title')})")

    r = client.get("/api/reports/", headers=user_headers)
    record_result("Reports", "/api/reports/", "GET", r.status_code, 200, r.status_code == 200, f"Retrieved {len(r.json())} reports")

    if report_id:
        r = client.get(f"/api/reports/{report_id}/download", headers=user_headers)
        record_result("Reports", f"/api/reports/{report_id}/download", "GET", r.status_code, 200, r.status_code == 200, f"Downloaded report ({len(r.content)} bytes)")

    # ----------------------------------------------------
    # Module 11: Real-time Notifications
    # ----------------------------------------------------
    print("\n--- 11. Testing Notifications System ---")
    r = client.get("/api/notifications", headers=user_headers)
    notifs = r.json() if r.status_code == 200 else []
    record_result("Notifications", "/api/notifications", "GET", r.status_code, 200, r.status_code == 200, f"Fetched {len(notifs)} system notifications")

    # ----------------------------------------------------
    # Module 12: Admin Privileged Customer Deletion (Cleanup)
    # ----------------------------------------------------
    print("\n--- 12. Testing RBAC Security & Cleanup ---")
    # Non-admin attempt should be forbidden
    r = client.delete(f"/api/customers/{customer_id}", headers=user_headers)
    record_result("RBAC Security", f"/api/customers/{customer_id} (user)", "DELETE", r.status_code, 403, r.status_code == 403, "Forbidden for standard user (Protected)")

    # Admin attempt should succeed
    r = client.delete(f"/api/customers/{customer_id}", headers=admin_headers)
    record_result("RBAC Security", f"/api/customers/{customer_id} (admin)", "DELETE", r.status_code, 204, r.status_code == 204, "Admin deletion permitted (204 No Content)")

    # ----------------------------------------------------
    # Summary Report
    # ----------------------------------------------------
    print("\n" + "=" * 80)
    print("                         DEMO TEST RESULTS SUMMARY")
    print("=" * 80)
    total_tests = len(test_results)
    passed_tests = sum(1 for t in test_results if t["passed"])
    failed_tests = total_tests - passed_tests

    print(f"Total Endpoints / Test Cases Checked: {total_tests}")
    print(f"Passed: {passed_tests} / {total_tests} ({(passed_tests/total_tests)*100:.1f}%)")
    print(f"Failed: {failed_tests} / {total_tests}")
    print("=" * 80)

    if failed_tests == 0:
        print(">>> ALL BACKEND MODULES AND API ENDPOINTS ARE FULLY OPERATIONAL FOR DEMO! <<<")
        return 0
    else:
        print(">>> SOME TESTS FAILED. PLEASE REVIEW LOGS. <<<")
        return 1

if __name__ == "__main__":
    exit_code = run_all_tests()
    sys.exit(exit_code)
