import pypdf
import re

r = pypdf.PdfReader('data/tnea_school_blocks.pdf')
page_dist = []
for idx, page in enumerate(r.pages):
    text = page.extract_text()
    for line in text.split('\n')[:8]:
        m = re.match(r'^\d+\s+([A-Z\s]+?)\s+[A-Za-z0-9]', line)
        if m:
            d = m.group(1).strip()
            if d not in ['TAMILNADU', 'SCHOOL', 'S NO', 'INFORMATIO']:
                page_dist.append((idx, d))
                break

ranges = {}
for idx, d in page_dist:
    if d not in ranges:
        ranges[d] = [idx, idx]
    else:
        ranges[d][1] = idx

print("Found", len(ranges), "districts:")
for d in sorted(ranges.keys()):
    print(f"'{d}': ({ranges[d][0]}, {ranges[d][1]}),")
