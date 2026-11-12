import urllib.request
import ssl
import re
import json

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://coimbatore.nic.in/education/', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

title = re.findall(r'<title>(.*?)</title>', html, re.I)
print('Title:', title)

# Find all links
links = re.findall(r'href=["\']([^"\']+)["\']', html)
edu_links = [l for l in links if any(k in l.lower() for k in ['school', 'edu', 'pdf', 'csv', 'xlsx', 'udise', 'document'])]
print(f'Relevant links count: {len(edu_links)}')
for l in edu_links:
    print(' -', l)
