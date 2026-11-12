import urllib.request
import ssl

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://schools.org.in/tamil-nadu/coimbatore', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
        txt = r.read().decode('utf-8', errors='ignore')
        print('Status:', r.status, 'Length:', len(txt))
        import re
        links = re.findall(r'href="(/tamil-nadu/coimbatore/[^"]+)"', txt)
        print('Blocks found:', len(links), links[:15])
except Exception as e:
    print('Error:', e)
