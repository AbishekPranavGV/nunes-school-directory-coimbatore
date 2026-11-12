import urllib.request, ssl, re

ctx = ssl._create_unverified_context()
url = 'https://schools.org.in/tamil-nadu/coimbatore/anaimalai/pums-angalakurichi'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
txt = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

matches = re.findall(r'href=["\'](?:.*?)(coimbatore/(\d{11})/[^"\']+)["\']', txt)
udises = set(m[1] for m in matches)
print(f'Cluster angalakurichi has {len(udises)} schools: {udises}')
for p, u in matches:
    print(f'  {u}: {p}')
