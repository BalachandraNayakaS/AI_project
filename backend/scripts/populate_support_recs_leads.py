import http.client
import json
import os
import sys
import random

# ensure app package importable
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from time import sleep

HOST = '127.0.0.1'
PORT = 8001

# helper http functions
def request(method, path, data=None, token=None):
    conn = http.client.HTTPConnection(HOST, PORT, timeout=10)
    headers = {}
    body = None
    if data is not None:
        body = json.dumps(data)
        headers['Content-Type'] = 'application/json'
    if token:
        headers['Authorization'] = f'Bearer {token}'
    conn.request(method, path, body, headers)
    resp = conn.getresponse()
    text = resp.read().decode()
    return resp.status, text

# login as existing user
status, body = request('POST', '/api/auth/login', {'username':'ui_test_user','password':'Password123!'})
if status != 200:
    print('Login failed for ui_test_user', status, body)
    raise SystemExit(1)
user_token = json.loads(body)['access_token']
print('Logged in as ui_test_user')

# fetch customers
status, customers_body = request('GET', '/api/customers/', token=user_token)
customers = json.loads(customers_body) if status==200 else []
print('Found', len(customers), 'customers')

# create support tickets for first N customers
for i, cust in enumerate(customers[:5]):
    for j in range(2):
        ticket = {
            'customer_id': cust['id'],
            'subject': f'Issue #{i+1}-{j+1} for {cust["name"]}',
            'message': f'This is a test ticket {j+1} for {cust["name"]}',
            'priority': random.choice(['low','medium','high']),
        }
        status, text = request('POST', '/api/tickets/', ticket, token=user_token)
        print('Create ticket', cust['id'], '=>', status)
        sleep(0.1)

# register an admin user
admin_user = {'username':'admin_user','password':'AdminPass123!','email':'admin@example.com','role':'admin'}
status, text = request('POST', '/api/auth/register', admin_user)
print('Register admin =>', status)
if status not in (200,201):
    print(text)

# login admin
status, body = request('POST', '/api/auth/login', {'username':'admin_user','password':'AdminPass123!'})
if status!=200:
    print('Admin login failed', status, body)
    # proceed only if we have admin
admin_token = None
if status==200:
    admin_token = json.loads(body)['access_token']
    print('Admin logged in')

# generate recommendations for customers (admin)
if admin_token:
    for cust in customers[:5]:
        path = f'/api/recommendations/generate?customer_id={cust["id"]}&type=upsell&context=Recent+activity+analysis'
        status, text = request('POST', path, token=admin_token)
        print('Generate recommendation for', cust['id'], '=>', status)
        sleep(0.1)

# Insert lead scores directly using DB session
try:
    from app.core.database import SessionLocal
    from app.models.models import LeadScore
    db = SessionLocal()
    for cust in customers[:5]:
        score = LeadScore(customer_id=cust['id'], score=round(random.uniform(40, 95),2), probability=round(random.uniform(0.1,0.99),2), recommended_action='Follow up with tailored offer')
        db.add(score)
    db.commit()
    print('Inserted lead scores into DB')
    db.close()
except Exception as exc:
    print('Failed to write lead scores directly:', exc)

print('Done')
