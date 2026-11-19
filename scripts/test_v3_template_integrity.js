const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('================================================================================');
console.log('🧪 RUNNING NUNES CIRCULAR EMAIL V3.0 TEMPLATE & INTEGRITY VERIFICATION');
console.log('================================================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
    failedTests++;
  }
}

// 1. Verify Assets on Disk
console.log('--- 1. ASSET VERIFICATION ---');
const logoPath = path.join(__dirname, '..', 'public', 'images', 'nunes_logo_transparent.png');
assert(fs.existsSync(logoPath), 'Official transparent logo exists in public/images/nunes_logo_transparent.png');

const pdfPath = path.join(__dirname, '..', 'public', 'attachments', 'Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf');
assert(fs.existsSync(pdfPath), '16-Page Catalogue PDF exists in public/attachments/');

if (fs.existsSync(pdfPath)) {
  const pdfBytes = fs.readFileSync(pdfPath);
  assert(pdfBytes.length === 5410301, `Exact PDF size matches 5,410,301 bytes (got ${pdfBytes.length})`);
  
  const hash = crypto.createHash('sha256').update(pdfBytes).digest('hex').toUpperCase();
  const expectedHash = 'CD09281107EC3CE075D24897E06B0BC08B2BED444E87751810025D1C495451A1';
  assert(hash === expectedHash, 'PDF SHA256 checksum matches verified catalog hash', `got: ${hash}`);
}

// 2. Read and Evaluate Template Engine
console.log('\n--- 2. TEMPLATE ENGINE & 11-SECTION SEQUENCE VERIFICATION ---');
const templateFilePath = path.join(__dirname, '..', 'src', 'lib', 'transportEmailTemplates.ts');
assert(fs.existsSync(templateFilePath), 'transportEmailTemplates.ts exists');

const templateCode = fs.readFileSync(templateFilePath, 'utf8');

// Colors Verification
const requiredColors = ['#092C55', '#087EC1', '#19B5E5', '#F4F7FB', '#243247', '#FFFFFF'];
requiredColors.forEach(color => {
  assert(templateCode.toUpperCase().includes(color.toUpperCase()), `Brand color ${color} is present in template engine`);
});

// Table structure verification
assert(templateCode.includes('<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"'), 'Uses email-safe table wrapper with inline presentation attributes');
assert(templateCode.includes('max-width:660px') || templateCode.includes('max-width:680px'), 'Desktop container width constrained between 640-680px');
assert(templateCode.includes('@media only screen and (max-width: 640px)'), 'Mobile fluid responsive CSS media queries present');

// Verify 11 Sections In Strict Sequence
const sectionMarkers = [
  '<!-- 1. OFFICIAL NUNES LOGO & LETTERHEAD',
  '<!-- 2. MAIN CIRCULAR HEADING',
  '<!-- 3. PERSONALISED INSTITUTION DETAILS',
  '<!-- 4. Salutation -->',
  '<!-- 5. Short Company Introduction -->',
  '<!-- 6. Breath Analyser Product Overview -->',
  '<!-- 7. Institutional Applications -->',
  '<!-- 8. ATTACHED PRODUCT CATALOGUE CARD',
  '<!-- 9. PRIMARY CALL TO ACTION',
  '<!-- 10. COMPANY SIGNATURE & CONTACT INFORMATION',
  '<!-- 11. UNSUBSCRIBE AND COMPLIANCE FOOTER'
];

let lastPos = -1;
let sequenceValid = true;
sectionMarkers.forEach((marker, idx) => {
  const pos = templateCode.indexOf(marker);
  if (pos === -1) {
    assert(false, `Section ${idx + 1} (${marker}) is present`);
    sequenceValid = false;
  } else if (pos < lastPos) {
    assert(false, `Section ${idx + 1} (${marker}) is in strict sequence (found before previous section)`);
    sequenceValid = false;
  } else {
    assert(true, `Section ${idx + 1} (${marker}) is in strict sequence`);
    lastPos = pos;
  }
});

// Product Overview 5 Bullets Verification
const expectedBullets = [
  'Portable and handheld breath analysers',
  'Rapid screening and non-contact screening devices',
  'Digital testers with LCD displays',
  'Professional models with integrated or external printing',
  'Advanced devices with data storage and reporting features'
];

expectedBullets.forEach(bullet => {
  assert(templateCode.includes(bullet), `Product portfolio includes bullet: "${bullet}"`);
});

// Verify Exactly Two CTAs (eliminating 4 competing buttons)
assert(templateCode.includes('Request a Quotation / Demonstration'), 'Primary CTA "Request a Quotation / Demonstration" is present');
assert(templateCode.includes('Contact NUNES Instrumentation'), 'Secondary CTA "Contact NUNES Instrumentation" is present');
assert(!templateCode.includes('Book Free Demo via WhatsApp'), 'Old competing promotional buttons removed from email template');
assert(!templateCode.includes('1-Click Request Subsidy Quote'), 'Old subsidy promotional button removed from email template');
assert(!templateCode.includes('0% BAN RISK'), 'Promotional badge "0% BAN RISK" removed from email template');
assert(!templateCode.includes('TLS 1.3 VERIFIED'), 'Promotional badge "TLS 1.3 VERIFIED" removed from email template');

// Check attachment link
assert(templateCode.includes('Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf'), 'Attached catalogue points to exact official 14-model PDF');

// 3. Verify Modal & Component Integration
console.log('\n--- 3. MODAL & PREVIEW CONTROLS VERIFICATION ---');
const previewModalPath = path.join(__dirname, '..', 'src', 'components', 'transport', 'TransportCircularPreviewModal.tsx');
assert(fs.existsSync(previewModalPath), 'TransportCircularPreviewModal.tsx exists');
const previewModalCode = fs.readFileSync(previewModalPath, 'utf8');

assert(previewModalCode.includes("previewDevice === 'desktop' ? '680px' : '375px'"), 'Preview modal includes 680px desktop and 375px mobile viewport toggles');
assert(previewModalCode.includes('SAMPLE_RECIPIENTS'), 'Interactive personalization selector across real institutions implemented');
assert(previewModalCode.includes('isPdfModalOpen'), '1-click 16-page catalogue PDF preview modal integrated');
assert(previewModalCode.includes('previewTab === \'html_source\''), 'Raw HTML source view and 1-click copy integrated');
assert(previewModalCode.includes('send_test_email'), 'Authorized test email dispatch action integrated');
assert(previewModalCode.includes('isAdminApproved'), 'Admin approval requirement gate implemented');

const quotationModalPath = path.join(__dirname, '..', 'src', 'components', 'transport', 'TransportQuotationModal.tsx');
assert(fs.existsSync(quotationModalPath), 'TransportQuotationModal.tsx enquiry modal exists');

console.log('\n================================================================================');
console.log(`RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('================================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
