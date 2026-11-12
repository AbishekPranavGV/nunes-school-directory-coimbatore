import urllib.request
import ssl

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://www.schoolspedia.in/schools/tamil-nadu/coimbatore', headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
})

try:
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        print(f'Status: {resp.status}, Content Length: {len(content)}')
        print(content[:500])
except Exception as e:
    print('Error:', e)
