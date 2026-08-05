import http.client
import json

HOST = '127.0.0.1'
PORT = 8001

def post(path, data):
    conn = http.client.HTTPConnection(HOST, PORT, timeout=10)
    payload = json.dumps(data)
    headers = {'Content-Type': 'application/json'}
    conn.request('POST', path, payload, headers)
    resp = conn.getresponse()
    body = resp.read().decode()
    return resp.status, body

# Register user with short password
user = {
    'username': 'testuser2',
    'password': 'pw',
    'email': 'test2@example.com'
}
print('Registering user...')
status, body = post('/api/auth/register', user)
print('Register:', status)
print(body)

# Login
print('\nLogging in...')
creds = {'username': 'testuser2', 'password': 'pw'}
status, body = post('/api/auth/login', creds)
print('Login:', status)
print(body)

if status == 200:
    data = json.loads(body)
    token = data.get('access_token')
    if token:
        print('\nUsing token to GET /api/customers/')
        conn = http.client.HTTPConnection(HOST, PORT, timeout=10)
        headers = {'Authorization': f'Bearer {token}'}
        conn.request('GET', '/api/customers/', headers=headers)
        resp = conn.getresponse()
        print('Customers status:', resp.status)
        print(resp.read().decode())
    else:
        print('No access_token in login response')
else:
    print('Login failed; cannot query customers')
