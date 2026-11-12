import re
from bs4 import BeautifulSoup

with open('scripts/test_schoolspedia.py', 'r') as f:
    pass

import urllib.request
import ssl

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://www.schoolspedia.in/schools/tamil-nadu/coimbatore', headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
})

content = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

# Check for Next.js JSON data
next_data = re.findall(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', content)
if next_data:
    print('Found __NEXT_DATA__! Length:', len(next_data[0]))
    import json
    data = json.loads(next_data[0])
    print('Keys:', list(data.keys()))
    print('pageProps keys:', list(data.get('props', {}).get('pageProps', {}).keys()))
    props = data.get('props', {}).get('pageProps', {})
    print('Sample props preview:', json.dumps(props, indent=2)[:1000])
else:
    print('No __NEXT_DATA__ found. Searching for school names and links...')
    links = re.findall(r'href="(/schools/tamil-nadu/coimbatore/[^"]+)"', content)
    print(f'Found {len(links)} school links: {links[:10]}')
