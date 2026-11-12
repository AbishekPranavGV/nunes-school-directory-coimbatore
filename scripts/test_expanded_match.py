import json, re

with open('data/harvested_schools_raw.json', 'r', encoding='utf-8') as f:
    udise_schools = json.load(f)

with open('data/tnea_coimbatore_schools.json', 'r', encoding='utf-8') as f:
    tnea_schools = json.load(f)

def expand_abbreviations(text):
    text = re.sub(r'\bGHSS\b', 'Government Higher Secondary School', text, flags=re.I)
    text = re.sub(r'\bGHS\b', 'Government High School', text, flags=re.I)
    text = re.sub(r'\bPUPS\b', 'Panchayat Union Primary School', text, flags=re.I)
    text = re.sub(r'\bPUMS\b', 'Panchayat Union Middle School', text, flags=re.I)
    text = re.sub(r'\bADW\b', 'Adi Dravidar Welfare', text, flags=re.I)
    text = re.sub(r'\bMAT\b', 'Matriculation', text, flags=re.I)
    text = re.sub(r'\bMATRIC\b', 'Matriculation', text, flags=re.I)
    text = re.sub(r'\bHSS\b', 'Higher Secondary School', text, flags=re.I)
    text = re.sub(r'\bHS\b', 'High School', text, flags=re.I)
    return text

def normalize_key(text):
    text = expand_abbreviations(text)
    tokens = re.findall(r'[a-z0-9]+', text.lower())
    # Keep significant tokens
    stop = {'school', 'hr', 'sec', 'higher', 'secondary', 'primary', 'middle', 'n', 'p', 'nur', 'the', 'and', 'for'}
    meaningful = [t for t in tokens if t not in stop]
    return " ".join(sorted(meaningful))

udise_keys = {}
for s in udise_schools:
    k = normalize_key(s['name'])
    if k not in udise_keys:
        udise_keys[k] = []
    udise_keys[k].append(s)

matched = 0
for t in tnea_schools:
    tk = normalize_key(t['name'])
    if tk in udise_keys:
        matched += 1

print(f'Expanded match: {matched} out of {len(tnea_schools)}')
