import urllib.request, ssl, re
from bs4 import BeautifulSoup

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://schools.org.in/coimbatore/33120700403/panchayat-union-primary-school-poovalaparuthy.html', headers={'User-Agent': 'Mozilla/5.0'})
txt = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

soup = BeautifulSoup(txt, 'html.parser')
print('Title:', soup.title.string if soup.title else '')

# Extract table key values
data = {}
for tr in soup.find_all('tr'):
    tds = tr.find_all(['th', 'td'])
    if len(tds) >= 2:
        k = tds[0].get_text(strip=True)
        v = tds[1].get_text(strip=True)
        data[k] = v

print('Extracted key-values count:', len(data))
for k, v in list(data.items())[:25]:
    print(f'  {k}: {v}')
