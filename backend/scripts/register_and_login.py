import http.client
import json

HOST = '127.0.0.1'
PORT = 8000

def post(path, data):
    conn = http.client.HTTPConnection(HOST, PORT, timeout=10)
    payload = json.dumps(data)
    headers = {'Content-Type': 'application/json'}
    conn.request('POST', path, payload, headers)
    resp = conn.getresponse()
    body = resp.read().decode()
    return resp.status, body

user = {'username': 'ui_test_user', 'password': 'Password123!', 'email': 'ui_test@example.com'}
print('Registering:', user['username'])
status, body = post('/api/auth/register', user)
print('Register status:', status)
print(body)

print('\nLogging in...')
creds = {'username': user['username'], 'password': user['password']}
status, body = post('/api/auth/login', creds)
print('Login status:', status)
print(body)

if status == 200:
    data = json.loads(body)
    token = data.get('access_token')
    print('\nToken:', token)
else:
    print('Login failed')
