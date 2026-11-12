import urllib.request, ssl, re

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://schools.org.in/tamil-nadu/coimbatore', headers={'User-Agent': 'Mozilla/5.0'})
txt = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

links = re.findall(r'href=["\']([^"\']+)["\']', txt)
relevant = [l for l in links if 'coimbatore' in l.lower() or 'tamil-nadu' in l.lower()]
print(f'Total links: {len(links)}, relevant: {len(relevant)}')
for r in relevant[:30]:
    print(' ', r)
