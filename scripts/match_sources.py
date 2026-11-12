import json, re

with open('data/harvested_schools_raw.json', 'r', encoding='utf-8') as f:
    udise_schools = json.load(f)

with open('data/tnea_coimbatore_schools.json', 'r', encoding='utf-8') as f:
    tnea_schools = json.load(f)

print(f'UDISE schools: {len(udise_schools)}')
print(f'TNEA schools: {len(tnea_schools)}')

def norm(text):
    text = re.sub(r'[^a-zA-Z0-9]', ' ', text.lower())
    # remove common stop words
    words = [w for w in text.split() if w not in ['school', 'hr', 'sec', 'matric', 'matriculation', 'higher', 'secondary', 'panchayat', 'union', 'primary', 'middle', 'govt', 'government']]
    return " ".join(words)

udise_norm_map = {}
for s in udise_schools:
    k = norm(s['name'])
    if k not in udise_norm_map:
        udise_norm_map[k] = []
    udise_norm_map[k].append(s)

direct_matches = 0
for t in tnea_schools:
    tk = norm(t['name'])
    if tk in udise_norm_map:
        direct_matches += 1

print(f'Direct/fuzzy matches between TNEA and UDISE: {direct_matches} out of {len(tnea_schools)}')
