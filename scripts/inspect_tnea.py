import pypdf

reader = pypdf.PdfReader('data/tnea_school_blocks.pdf')
print(f'Total pages in TNEA PDF: {len(reader.pages)}')

# Inspect first page
text_p0 = reader.pages[0].extract_text()
print('--- Page 1 preview ---')
print(text_p0[:500])

# Search for pages mentioning Coimbatore
coimbatore_pages = []
for idx, page in enumerate(reader.pages):
    txt = page.extract_text()
    if 'COIMBATORE' in txt.upper():
        coimbatore_pages.append(idx)

print(f'Pages mentioning COIMBATORE: {len(coimbatore_pages)} (pages {coimbatore_pages[:10]} ...)')
if coimbatore_pages:
    print('--- Sample Coimbatore Page text ---')
    print(reader.pages[coimbatore_pages[0]].extract_text()[:1000])
