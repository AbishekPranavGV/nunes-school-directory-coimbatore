import urllib.request, ssl, re

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://www.schoolspedia.in/schools/tamil-nadu/coimbatore', headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

# Search for any links
links = re.findall(r'href=["\']([^"\']+)["\']', content)
coimb_links = [l for l in links if 'coimbatore' in l.lower() or 'school' in l.lower()]
print(f'Total links: {len(links)}, Coimb/School links: {len(coimb_links)}')
print('Sample links:', coimb_links[:20])

# Search for total count or headings
h1_h3 = re.findall(r'<h[1-3][^>]*>(.*?)</h[1-3]>', content)
print('Headings:', h1_h3[:10])

# Let's save a snippet of content
with open('data/schoolspedia_sample.html', 'w', encoding='utf-8') as f:
    f.write(content[:10000])
