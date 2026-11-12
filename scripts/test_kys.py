import urllib.request, ssl, json

ctx = ssl._create_unverified_context()

endpoints = [
    'https://kys.udiseplus.gov.in/api/v1/search',
    'https://kys.udiseplus.gov.in/api/v1/school/33120700403',
    'https://kys.udiseplus.gov.in/api/school/33120700403',
    'https://udiseplus.gov.in/api/v1/school/33120700403'
]

for ep in endpoints:
    try:
        req = urllib.request.Request(ep, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, context=ctx, timeout=5)
        print(f'{ep}: {res.status}')
    except Exception as e:
        print(f'{ep}: {e}')
