import urllib.request, ssl, re, time, json, os

ctx = ssl._create_unverified_context()

blocks = [
    'anaimalai', 'annur', 'coimbatore-city', 'karamadai', 
    'kinathukkadavu', 'madukkarai', 'p.n.palayam', 'perur', 
    'pollachi-north', 'pollachi-south', 's.s.kulam', 'sultanpet', 
    'sulur', 'thondamuthur', 'valparai'
]

clusters_by_block = {}
print('Fetching cluster list for all blocks...')
for b in blocks:
    b_url = f'https://schools.org.in/tamil-nadu/coimbatore/{b}'
    try:
        req = urllib.request.Request(b_url, headers={'User-Agent': 'Mozilla/5.0'})
        txt = urllib.request.urlopen(req, context=ctx, timeout=8).read().decode('utf-8', errors='ignore')
        c_links = list(set(re.findall(r'href=["\'](?:.*?)(tamil-nadu/coimbatore/' + b + r'/[^"\']+)["\']', txt)))
        clusters_by_block[b] = c_links
        print(f'Block {b}: {len(c_links)} clusters')
    except Exception as e:
        print(f'Block {b} failed: {e}')
    time.sleep(0.15)

total_clusters = sum(len(v) for v in clusters_by_block.values())
print(f'Total clusters found across Coimbatore: {total_clusters}')

with open('data/coimbatore_clusters.json', 'w') as f:
    json.dump(clusters_by_block, f, indent=2)
