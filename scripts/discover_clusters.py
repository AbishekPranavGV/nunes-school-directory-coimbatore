import urllib.request, ssl, re, time, json

ctx = ssl._create_unverified_context()

blocks = [
    'anaimalai', 'annur', 'coimbatore-city', 'karamadai', 
    'kinathukkadavu', 'madukkarai', 'p.n.palayam', 'perur', 
    'pollachi-north', 'pollachi-south', 's.s.kulam', 'sultanpet', 
    'sulur', 'thondamuthur', 'valparai'
]

discovered_schools = {}

print('Discovering clusters and schools across Coimbatore blocks...')
for b in blocks:
    b_url = f'https://schools.org.in/tamil-nadu/coimbatore/{b}'
    try:
        req = urllib.request.Request(b_url, headers={'User-Agent': 'Mozilla/5.0'})
        txt = urllib.request.urlopen(req, context=ctx, timeout=8).read().decode('utf-8', errors='ignore')
        
        # Cluster/Village links
        cluster_links = set(re.findall(r'href=["\'](?:.*?)(tamil-nadu/coimbatore/' + b + r'/[^"\']+)["\']', txt))
        # Direct school links
        direct_schools = re.findall(r'href=["\'](?:.*?)(coimbatore/(\d{11})/[^"\']+)["\']', txt)
        for path, u in direct_schools:
            discovered_schools[u] = {'block': b, 'path': path}
            
        print(f'Block {b}: {len(cluster_links)} clusters, {len(direct_schools)} direct schools')
    except Exception as e:
        print(f'Block {b} failed: {e}')
    time.sleep(0.2)

print(f'Total direct schools so far: {len(discovered_schools)}')
