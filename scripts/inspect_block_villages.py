import urllib.request, ssl, re

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://schools.org.in/tamil-nadu/coimbatore/anaimalai', headers={'User-Agent': 'Mozilla/5.0'})
txt = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

links = re.findall(r'href=["\']([^"\']+)["\']', txt)
village_links = [l for l in links if 'anaimalai/' in l]
print(f'Total village links in anaimalai: {len(village_links)}')
for l in village_links[:15]:
    print(' ', l)
