import http.client, json
HOST='127.0.0.1'
PORT=8001

creds={'username':'ui_test_user','password':'Password123!'}
conn=http.client.HTTPConnection(HOST,PORT,timeout=10)
conn.request('POST','/api/auth/login',json.dumps(creds),{'Content-Type':'application/json'})
resp=conn.getresponse(); body=resp.read().decode()
if resp.status!=200:
    print('login failed',resp.status,body); raise SystemExit(1)
token=json.loads(body)['access_token']
conn=http.client.HTTPConnection(HOST,PORT,timeout=10)
conn.request('GET','/api/analytics/dashboard',headers={'Authorization':f'Bearer {token}'})
resp=conn.getresponse(); print(resp.status); print(resp.read().decode())
