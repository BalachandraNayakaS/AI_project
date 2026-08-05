"""
Standalone HTTP-based automated check.

Starts a uvicorn subprocess on port 8002, registers and logs in a user,
calls `/api/customers/` and `/api/analytics/dashboard`, and asserts
the expected keys are present.

Run with: python tests/test_dashboard_and_customers.py
"""
import os
import sys
import time
import json
import subprocess
import http.client

DB_FILE = "test_app.db"
PORT = 8002


def request(method, path, data=None, token=None, port=PORT):
    conn = http.client.HTTPConnection('127.0.0.1', port, timeout=10)
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


def main():
    # ensure clean DB
    try:
        if os.path.exists(DB_FILE):
            os.remove(DB_FILE)
    except Exception:
        pass

    env = os.environ.copy()
    env['DATABASE_URL'] = f"sqlite:///./{DB_FILE}"

    # start uvicorn subprocess
    proc = subprocess.Popen([sys.executable, '-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', str(PORT)], env=env)
    try:
        # wait for server to be ready
        start = time.time()
        while True:
            try:
                status, _ = request('GET', '/')
                if status == 200:
                    break
            except Exception:
                pass
            if time.time() - start > 20:
                raise RuntimeError('Server did not start in time')
            time.sleep(0.3)

        # register user
        status, body = request('POST', '/api/auth/register', {'username': 'test_user', 'password': 'TestPass123!', 'email': 'test_user@example.com'})
        assert status in (200, 201), f'register failed: {status} {body}'

        # login
        status, body = request('POST', '/api/auth/login', {'username': 'test_user', 'password': 'TestPass123!'})
        assert status == 200, f'login failed: {status} {body}'
        token = json.loads(body)['access_token']

        # call customers
        status, body = request('GET', '/api/customers/', token=token)
        assert status == 200, f'customers endpoint failed: {status} {body}'

        # call analytics dashboard and check keys
        status, body = request('GET', '/api/analytics/dashboard', token=token)
        assert status == 200, f'dashboard failed: {status} {body}'
        payload = json.loads(body)
        for key in ('customers', 'tickets', 'lead_conversion', 'lead_scores'):
            assert key in payload, f'missing {key} in dashboard'

        print('TEST PASSED')
        rc = 0
    except AssertionError as e:
        print('TEST FAILED:', e)
        rc = 1
    except Exception as exc:
        print('ERROR:', exc)
        rc = 2
    finally:
        try:
            proc.terminate()
            proc.wait(timeout=5)
        except Exception:
            pass
        try:
            if os.path.exists(DB_FILE):
                os.remove(DB_FILE)
        except Exception:
            pass
    sys.exit(rc)


if __name__ == '__main__':
    main()
