import http.client
import json
from datetime import datetime, timedelta

HOST = '127.0.0.1'
PORT = 8000

ADMIN = {'username': 'ui_test_user', 'password': 'Password123!'}

CUSTOMERS = [
    {'name':'Globex Corporation','email':'info@globex.example','phone':'+1-555-1001','company':'Globex','city':'Springfield','country':'USA'},
    {'name':'Initech','email':'contact@initech.example','phone':'+1-555-1002','company':'Initech','city':'Austin','country':'USA'},
    {'name':'Umbrella Corp','email':'hello@umbrella.example','phone':'+44-20-7000','company':'Umbrella','city':'London','country':'UK'},
    {'name':'Stark Industries','email':'sales@stark.example','phone':'+1-555-1004','company':'Stark','city':'Los Angeles','country':'USA'},
    {'name':'Wayne Enterprises','email':'info@wayne.example','phone':'+1-555-1005','company':'Wayne','city':'Gotham','country':'USA'},
]

SALES = [
    {'product':'Product A','amount':199.99,'quantity':2},
    {'product':'Product B','amount':349.5,'quantity':1},
    {'product':'Service C','amount':1200.0,'quantity':1},
]


def post(path, data, token=None):
    conn = http.client.HTTPConnection(HOST, PORT, timeout=10)
    payload = json.dumps(data)
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    conn.request('POST', path, payload, headers)
    resp = conn.getresponse()
    body = resp.read().decode()
    return resp.status, body


def get(path, token=None):
    conn = http.client.HTTPConnection(HOST, PORT, timeout=10)
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    conn.request('GET', path, headers=headers)
    resp = conn.getresponse()
    body = resp.read().decode()
    return resp.status, body

# login
status, body = post('/api/auth/login', ADMIN)
if status != 200:
    print('Login failed, registering user first...')
    reg_user = {'username': 'ui_test_user', 'password': 'Password123!', 'email': 'ui_test@example.com', 'role': 'admin'}
    post('/api/auth/register', reg_user)
    status, body = post('/api/auth/login', ADMIN)
    if status != 200:
        print('Login still failed:', status, body)
        raise SystemExit(1)

token = json.loads(body)['access_token']
print('Logged in, token length:', len(token))

created_customers = []
for c in CUSTOMERS:
    data = c.copy()
    data.setdefault('status','active')
    status, body = post('/api/customers/', data, token=token)
    print('Create customer', c['name'], '->', status)
    if status == 201:
        created = json.loads(body)
        created_customers.append(created)

# create sales for first 3 customers
now = datetime.utcnow()
for i, cust in enumerate(created_customers[:3]):
    for j, s in enumerate(SALES):
        sale = {
            'customer_id': cust['id'],
            'product': s['product'],
            'amount': s['amount'],
            'quantity': s['quantity'],
            'sales_date': (now - timedelta(days=(i*3 + j))).isoformat(),
        }
        status, body = post('/api/sales/', sale, token=token)
        print('Create sale for', cust['name'], '->', status)

# show totals
status, customers_body = get('/api/customers/', token=token)
status, sales_body = get('/api/sales/', token=token)
print('\nCustomers:', status)
print(customers_body[:1000])
print('\nSales:', status)
print(sales_body[:1000])
