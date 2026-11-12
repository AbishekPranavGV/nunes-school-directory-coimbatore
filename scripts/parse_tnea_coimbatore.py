import pypdf
import re
import json

reader = pypdf.PdfReader('data/tnea_school_blocks.pdf')
print(f'Total pages: {len(reader.pages)}')

coimbatore_schools = []

# Pattern to capture school lines in TNEA:
# S NO DISTRICT BLOCK SCHOOL NAME SCHOOL TYPE PINCODE
# Note: School name may span multiple words, School Type can be: 'Government', 'Fully Aided', 'Partially Aided', 'Un-aided', 'Central Government', etc.
# PINCODE is a 6-digit number at the end.

for p_idx in range(90, 140): # Check pages around Coimbatore
    page_text = reader.pages[p_idx].extract_text()
    lines = page_text.split('\n')
    for line in lines:
        line = line.strip()
        if 'COIMBATORE' in line:
            coimbatore_schools.append({'page': p_idx + 1, 'raw': line})

print(f'Found {len(coimbatore_schools)} raw COIMBATORE lines on pages 91-140.')
if coimbatore_schools:
    print('First 5:')
    for s in coimbatore_schools[:5]:
        print(s)
    print('Last 5:')
    for s in coimbatore_schools[-5:]:
        print(s)
