import pypdf
import re
import json

reader = pypdf.PdfReader('data/tnea_school_blocks.pdf')

schools = []

for page_idx in range(91, 130):
    text = reader.pages[page_idx].extract_text()
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        # Look for pattern: <S_NO> COIMBATORE <BLOCK> <SCHOOL_NAME> <SCHOOL_TYPE> <PINCODE>
        # Example: 3049 COIMBATORE Anaimalai ANANYA VIDYALAYA MATRIC HR. SEC. SCHOOL Un-aided 642007
        m = re.match(r'^(\d+)\s+COIMBATORE\s+([A-Za-z\.\s]+?)\s+(.*?)\s+(Government|Fully\s+Aided|Partially\s+Aided|Un-aided|Central\s+Government)\s+(\d{6})$', line, re.IGNORECASE)
        if m:
            s_no = int(m.group(1))
            block = m.group(2).strip()
            name = m.group(3).strip()
            stype = m.group(4).strip()
            pin = m.group(5).strip()
            schools.append({
                's_no': s_no,
                'district': 'Coimbatore',
                'block': block,
                'name': name,
                'school_type': stype,
                'pincode': pin,
                'source': 'TNEA 2026 School Block Information PDF',
                'page': page_idx + 1
            })

print(f'Matched {len(schools)} Coimbatore schools via regex out of 1240 expected.')
if len(schools) < 1240:
    print('Some lines might have wrapped or had special characters. Checking unparsed COIMBATORE lines...')
    matched_s_nos = set(s['s_no'] for s in schools)
    unmatched = []
    for page_idx in range(91, 130):
        text = reader.pages[page_idx].extract_text()
        for line in text.split('\n'):
            line = line.strip()
            if 'COIMBATORE' in line:
                m_no = re.match(r'^(\d+)\s+COIMBATORE', line)
                if m_no:
                    num = int(m_no.group(1))
                    if num not in matched_s_nos:
                        unmatched.append(line)
    print(f'Unmatched count: {len(unmatched)}')
    for u in unmatched[:10]:
        print('  UNMATCHED:', u)
