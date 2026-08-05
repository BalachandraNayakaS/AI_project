import http.client
import json

HOST = '127.0.0.1'
PORT = 8001

creds = {'username': 'ui_test_user', 'password': 'Password123!'}

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

# Login
status, body = post('/api/auth/login', creds)
print('Login status:', status)
print(body)
if status != 200:
    raise SystemExit('Login failed')
access_token = json.loads(body).get('access_token')

# Create customer
customer = {
    'name': 'Acme Corp',
    'email': 'contact@acme.example',
    'phone': '+1-555-0100',
    'company': 'Acme Corp',
    'city': 'Metropolis',
    'country': 'Neverland',
    'status': 'active'
}
status, body = post('/api/customers/', customer, token=access_token)
print('\nCreate customer status:', status)
print(body)

# List customers
conn = http.client.HTTPConnection(HOST, PORT, timeout=10)
headers = {'Authorization': f'Bearer {access_token}'}
conn.request('GET', '/api/customers/', headers=headers)
resp = conn.getresponse()
print('\nCustomers status:', resp.status)
print(resp.read().decode())
