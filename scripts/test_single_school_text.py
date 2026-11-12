import sys, urllib.request, ssl
from bs4 import BeautifulSoup
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://schools.org.in/coimbatore/33120700403/panchayat-union-primary-school-poovalaparuthy.html', headers={'User-Agent': 'Mozilla/5.0'})
txt = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

soup = BeautifulSoup(txt, 'html.parser')
paragraphs = [p.get_text(strip=True) for p in soup.find_all(['p', 'li']) if len(p.get_text(strip=True)) > 20]
for p in paragraphs[:25]:
    print('P:', p)
