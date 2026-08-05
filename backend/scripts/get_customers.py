import http.client
import json

HOST = '127.0.0.1'
PORT = 8001

creds = {'username': 'ui_test_user', 'password': 'Password123!'}

conn = http.client.HTTPConnection(HOST, PORT, timeout=10)
conn.request('POST', '/api/auth/login', json.dumps(creds), {'Content-Type':'application/json'})
resp = conn.getresponse()
login_body = resp.read().decode()
print('Login status:', resp.status)
print(login_body)
if resp.status != 200:
    raise SystemExit('Login failed')

data = json.loads(login_body)
access_token = data.get('access_token')

# Call customers
conn = http.client.HTTPConnection(HOST, PORT, timeout=10)
headers = {'Authorization': f'Bearer {access_token}'}
conn.request('GET', '/api/customers/', headers=headers)
resp = conn.getresponse()
print('\nCustomers status:', resp.status)
print(resp.read().decode())
