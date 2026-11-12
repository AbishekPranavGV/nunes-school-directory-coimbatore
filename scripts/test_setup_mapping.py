import json
import re
import random

with open('data/harvested_schools_raw.json', 'r', encoding='utf-8') as f:
    udise_schools = json.load(f)

with open('data/tnea_coimbatore_schools.json', 'r', encoding='utf-8') as f:
    tnea_schools = json.load(f)

print(f'UDISE schools loaded: {len(udise_schools)}')
print(f'TNEA schools loaded: {len(tnea_schools)}')

# Verify block mapping
block_map = {
    'anaimalai': 'Anaimalai',
    'annur': 'Annur',
    'coimbatore-city': 'Coimbatore City',
    'coimbatore city': 'Coimbatore City',
    'karamadai': 'Karamadai',
    'kinathukkadavu': 'Kinathukadavu',
    'kinathukadavu': 'Kinathukadavu',
    'madukkarai': 'Madukkarai',
    'p.n.palayam': 'Periyanaickanpalayam',
    'periyanaickan palayam': 'Periyanaickanpalayam',
    'perur': 'Perur',
    'pollachi-north': 'Pollachi North',
    'pollachi north': 'Pollachi North',
    'pollachi-south': 'Pollachi South',
    'pollachi south': 'Pollachi South',
    's.s.kulam': 'S.S.Kulam',
    'sarkar samakulam': 'S.S.Kulam',
    'sultanpet': 'Sultanpet',
    'sulur': 'Sulur',
    'thondamuthur': 'Thondamuthur',
    'valparai': 'Valparai'
}

urban_blocks = {'Coimbatore City', 'Perur', 'Madukkarai', 'Periyanaickanpalayam', 'Sulur'}

# Pincode map by block
block_pins = {
    'Anaimalai': '642104',
    'Annur': '641653',
    'Coimbatore City': '641001',
    'Karamadai': '641104',
    'Kinathukadavu': '642109',
    'Madukkarai': '641105',
    'Periyanaickanpalayam': '641020',
    'Perur': '641010',
    'Pollachi North': '642001',
    'Pollachi South': '642002',
    'S.S.Kulam': '641107',
    'Sultanpet': '641669',
    'Sulur': '641402',
    'Thondamuthur': '641109',
    'Valparai': '642127'
}

# Geocoordinates central per block
block_coords = {
    'Anaimalai': (10.5844, 76.9317),
    'Annur': (11.2330, 77.1770),
    'Coimbatore City': (11.0168, 76.9558),
    'Karamadai': (11.2464, 76.9592),
    'Kinathukadavu': (10.8222, 77.0194),
    'Madukkarai': (10.9022, 76.9622),
    'Periyanaickanpalayam': (11.1444, 76.9352),
    'Perur': (10.9708, 76.9189),
    'Pollachi North': (10.6609, 77.0048),
    'Pollachi South': (10.6420, 77.0120),
    'S.S.Kulam': (11.1378, 77.0278),
    'Sultanpet': (10.9328, 77.1950),
    'Sulur': (11.0267, 77.1264),
    'Thondamuthur': (10.9989, 76.8294),
    'Valparai': (10.3256, 76.9558)
}

print('Reference maps configured.')
