import urllib.request, ssl, re, time, json, os
from concurrent.futures import ThreadPoolExecutor, as_completed

ctx = ssl._create_unverified_context()

with open('data/coimbatore_clusters.json', 'r') as f:
    clusters_by_block = json.load(f)

all_cluster_items = []
for block, clusters in clusters_by_block.items():
    for c_path in clusters:
        all_cluster_items.append({'block': block, 'path': c_path})

print(f'Total cluster items to harvest: {len(all_cluster_items)}')

def fetch_cluster(item):
    block = item['block']
    path = item['path']
    url = f'https://schools.org.in/{path}'
    schools = []
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            txt = resp.read().decode('utf-8', errors='ignore')
            # Extract links with format: href="...coimbatore/3312.../school-slug.html"
            matches = re.findall(r'href=["\'](?:.*?)(coimbatore/(\d{11})/([^"\']+?)\.html)["\']', txt)
            for full_path, udise, slug in matches:
                # slug to title
                title = slug.replace('-', ' ').title()
                schools.append({
                    'udise_code': udise,
                    'name_slug': slug,
                    'name': title,
                    'block': block,
                    'cluster': path.split('/')[-1],
                    'url': f'https://schools.org.in/coimbatore/{udise}/{slug}.html',
                    'source': 'schools.org.in / UDISE Directory'
                })
    except Exception as e:
        print(f"Error fetching {path}: {e}")
    return schools

all_schools_map = {}
completed = 0

with ThreadPoolExecutor(max_workers=6) as executor:
    future_to_cluster = {executor.submit(fetch_cluster, item): item for item in all_cluster_items}
    for future in as_completed(future_to_cluster):
        completed += 1
        schools = future.result()
        for s in schools:
            all_schools_map[s['udise_code']] = s
        if completed % 20 == 0 or completed == len(all_cluster_items):
            print(f'Progress: {completed}/{len(all_cluster_items)} clusters fetched ({len(all_schools_map)} unique schools)')

print(f'Final unique schools collected: {len(all_schools_map)}')
with open('data/harvested_schools_raw.json', 'w', encoding='utf-8') as f:
    json.dump(list(all_schools_map.values()), f, indent=2)
