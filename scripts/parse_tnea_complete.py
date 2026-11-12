import pypdf
import re
import json

reader = pypdf.PdfReader('data/tnea_school_blocks.pdf')

tnea_records = []

for page_idx in range(91, 130):
    text = reader.pages[page_idx].extract_text()
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if not re.match(r'^\d+\s+COIMBATORE', line, re.I):
            continue
        
        # Regex to capture:
        # Serial No, Block, School Name, School Type, and optional Pincode
        parts = line.split()
        s_no = int(parts[0])
        # parts[1] is COIMBATORE
        
        # Check if last token is 6-digit PIN
        pin = None
        if len(parts) > 4 and re.match(r'^\d{6}$', parts[-1]):
            pin = parts[-1]
            content_tokens = parts[2:-1]
        else:
            content_tokens = parts[2:]
            
        content_str = " ".join(content_tokens)
        
        # Types: Government, Fully Aided, Partially Aided, Un-aided, Central Govt, Central Government
        type_pattern = r'(Government|Fully\s+Aided|Partially\s+Aided|Un-aided|Central\s+Govt|Central\s+Government)$'
        m_type = re.search(type_pattern, content_str, re.I)
        
        school_type = 'Unknown'
        block_and_name = content_str
        if m_type:
            school_type = m_type.group(1).strip()
            block_and_name = content_str[:m_type.start()].strip()
            
        # Known blocks in TNEA:
        blocks_list = [
            'Coimbatore city', 'Anaimalai', 'Annur', 'Karamadai', 'Kinathukkadavu',
            'Madukkarai', 'Periyanaickan Palayam', 'Perur', 'Pollachi North',
            'Pollachi South', 'S.S.Kulam', 'Sarkar Samakulam', 'Sultanpet',
            'Sulur', 'Thondamuthur', 'Valparai'
        ]
        
        matched_block = 'Unknown'
        school_name = block_and_name
        for b in sorted(blocks_list, key=len, reverse=True):
            if block_and_name.lower().startswith(b.lower()):
                matched_block = b
                school_name = block_and_name[len(b):].strip()
                break
                
        tnea_records.append({
            's_no': s_no,
            'district': 'Coimbatore',
            'block': matched_block,
            'name': school_name,
            'school_type': school_type,
            'pincode': pin,
            'raw': line,
            'source': 'TNEA 2026 School Block Information PDF',
            'page': page_idx + 1
        })

print(f'Total TNEA records parsed: {len(tnea_records)}')
print(f'Expected: 1240 (from S.No 3049 to 4288: {4288 - 3049 + 1})')
s_nos = [r['s_no'] for r in tnea_records]
print(f'Min S.No: {min(s_nos)}, Max S.No: {max(s_nos)}, Unique S.Nos: {len(set(s_nos))}')

with open('data/tnea_coimbatore_schools.json', 'w', encoding='utf-8') as f:
    json.dump(tnea_records, f, indent=2)
