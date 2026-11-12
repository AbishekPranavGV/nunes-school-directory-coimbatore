import urllib.request, ssl, re, time

ctx = ssl._create_unverified_context()

blocks = [
    'anaimalai', 'annur', 'coimbatore-city', 'karamadai', 
    'kinathukkadavu', 'madukkarai', 'p.n.palayam', 'perur', 
    'pollachi-north', 'pollachi-south', 's.s.kulam', 'sultanpet', 
    'sulur', 'thondamuthur', 'valparai'
]

total_schools = 0
block_counts = {}

for b in blocks:
    url = f'https://schools.org.in/tamil-nadu/coimbatore/{b}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        txt = urllib.request.urlopen(req, context=ctx, timeout=8).read().decode('utf-8', errors='ignore')
        # Find links with 11-digit numbers
        matches = re.findall(r'href=["\'](?:.*?)(coimbatore/(\d{11})/[^"\']+)["\']', txt)
        # Dedupe by UDISE
        udises = set(m[1] for m in matches)
        block_counts[b] = len(udises)
        total_schools += len(udises)
        print(f'Block {b}: {len(udises)} schools found')
        time.sleep(0.3)
    except Exception as e:
        print(f'Block {b} error: {e}')

print(f'Total across 15 blocks: {total_schools}')
