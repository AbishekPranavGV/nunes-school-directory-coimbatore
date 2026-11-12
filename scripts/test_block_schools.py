import urllib.request, ssl, re

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://schools.org.in/tamil-nadu/coimbatore/anaimalai', headers={'User-Agent': 'Mozilla/5.0'})
txt = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

links = re.findall(r'href=["\']([^"\']+)["\']', txt)
school_links = [l for l in links if re.search(r'/\d{11}/', l) or '3312' in l]
print(f'Total links: {len(links)}, UDISE links: {len(school_links)}')
print('Sample UDISE links:', school_links[:10])

# Also check table or text
names = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>([^<]+)</a>', txt)
udise_names = [(h, n.strip()) for h, n in names if any(c.isdigit() for c in h)]
print(f'UDISE items: {len(udise_names)}')
for h, n in udise_names[:10]:
    print(f'  {n} -> {h}')
