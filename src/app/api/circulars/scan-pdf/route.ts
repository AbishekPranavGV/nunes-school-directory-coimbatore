import { NextRequest, NextResponse } from 'next/server';
import { CircularItem } from '@/types';
import { NUNES_COIMBATORE_LOCATIONS, NUNES_CATALOGUE_NETLIFY_URL } from '@/lib/data/nunesBreathAnalysers';

export const dynamic = 'force-dynamic';

// Helper to extract text from a raw PDF buffer in pure JS/Node without external C binaries
function extractTextFromPdfBuffer(buffer: Buffer): string {
  try {
    const raw = buffer.toString('latin1');
    
    // 1. Check for text inside parentheses before Tj or TJ operator
    const textPieces: string[] = [];
    const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
    let match: RegExpExecArray | null;
    while ((match = tjRegex.exec(raw)) !== null) {
      if (match[1] && match[1].length > 1) {
        textPieces.push(match[1]);
      }
    }

    // 2. Check for TJ array syntax [(text)-10(more text)]
    const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
    while ((match = tjArrayRegex.exec(raw)) !== null) {
      const inner = match[1];
      const strMatches = inner.match(/\(([^)]+)\)/g);
      if (strMatches) {
        strMatches.forEach(s => textPieces.push(s.slice(1, -1)));
      }
    }

    // 3. Fallback: Extract ASCII word sequences from streams
    if (textPieces.length < 5) {
      const cleanAscii = raw
        .replace(/[^a-zA-Z0-9\s.,;:/\-_()#%]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const words = cleanAscii.split(' ').filter(w => w.length > 2);
      if (words.length > 20) {
        return words.slice(0, 300).join(' ');
      }
    }

    return textPieces.join(' ').replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.warn('[PDF Extract] Fallback parsing:', err);
    return '';
  }
}

// Generate the 3 Coimbatore locations block verbatim from image media_1794888352852.png
function getVerbatimLocationsEmail(): string {
  return `★ OUR COIMBATORE LOCATIONS (VISIT OUR SERVICE & SALES HUBS):

1. RATHINAPURI:
11-A, 2nd Cross, Sundarar St,
Opp. to LaLa Mahall,
Nalvar Layout, Rathinapuri,
Coimbatore, Tamil Nadu 641027
Phone: +91 89409 44000

2. GOPALAPURAM:
6, GJ Chandran Complex,
Head Quarters Rd,
Opp. to CSI Church,
Gopalapuram,
Coimbatore, Tamil Nadu 641018
Phone: +91 89409 33000

3. GANDHIPURAM:
218-628, 1st St,
Cross Cut, Gandhipuram,
Coimbatore,
Tamil Nadu 641012
Phone: +91 0422 2499444 / +91 89409 44000`;
}

function getVerbatimLocationsWhatsApp(): string {
  return `📍 *OUR COIMBATORE LOCATIONS:*

1️⃣ *RATHINAPURI:*
11-A, 2nd Cross, Sundarar St, Opp. to LaLa Mahall, Nalvar Layout, Rathinapuri, Coimbatore, TN 641027
📞 Phone: +91 89409 44000

2️⃣ *GOPALAPURAM:*
6, GJ Chandran Complex, Head Quarters Rd, Opp. to CSI Church, Gopalapuram, Coimbatore, TN 641018
📞 Phone: +91 89409 33000

3️⃣ *GANDHIPURAM:*
218-628, 1st St, Cross Cut, Gandhipuram, Coimbatore, TN 641012
📞 Phone: +91 0422 2499444 / +91 89409 44000`;
}

export async function POST(req: NextRequest) {
  try {
    let fileName = 'Uploaded_Document.pdf';
    let fileSizeKb = 340;
    let extractedText = '';
    let customSubject = '';
    let customTarget = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (file) {
        fileName = file.name || 'Uploaded_Document.pdf';
        fileSizeKb = Math.round(file.size / 1024) || 120;
        const arrayBuf = await file.arrayBuffer();
        const buf = Buffer.from(arrayBuf);
        extractedText = extractTextFromPdfBuffer(buf);
      }
      if (formData.get('subject')) customSubject = String(formData.get('subject'));
      if (formData.get('target_group')) customTarget = String(formData.get('target_group'));
    } else {
      const body = await req.json();
      fileName = body.fileName || body.file_name || 'Scanned_Circular_Document.pdf';
      fileSizeKb = body.fileSizeKb || body.file_size_kb || 480;
      extractedText = body.extractedText || body.extracted_text || body.raw_text || '';
      customSubject = body.subject || '';
      customTarget = body.target_group || '';
    }

    const textLower = (extractedText + ' ' + fileName + ' ' + customSubject).toLowerCase();

    // Classification & Intelligent Template Synthesis
    let title = '';
    let refNumber = '';
    let subject = '';
    let bodyText = '';
    let emailSubject = '';
    let emailBody = '';
    let whatsappBody = '';
    let targetGroup = customTarget || 'All South India Schools (21,120 Institutions)';
    let isBreathAnalyser = false;

    const randNum = Math.floor(100 + Math.random() * 900);

    if (textLower.includes('breath') || textLower.includes('alcohol') || textLower.includes('analyser') || textLower.includes('bus') || textLower.includes('driver') || textLower.includes('transport') || textLower.includes('fleet')) {
      isBreathAnalyser = true;
      title = 'Mandatory School Bus Driver Alcohol Screening & Campus Fleet Safety Compliance (Supreme Court & Transport Directorate Mandates)';
      refNumber = `NUNES/SAFE-CAMPUS/2026/CIRC-${randNum}`;
      subject = 'Deployment of Certified Breath Alcohol Analysers with Evidential Camera, GPS & Thermal Printing for School Transportation Safety (Academic Year 2026-27)';
      targetGroup = 'All South India Schools (21,120 Institutions)';

      bodyText = `To The Correspondents, Principals, and Transport Management Officers,
All Educational Institutions (State Board, Matriculation, CBSE & ICSE),
Tamil Nadu & Kerala.

Subject: Mandatory Pre-Trip Breath Alcohol Screening Protocol for School Bus Drivers & Student Transport Fleet Safety (AY 2026-27).

Pursuant to Supreme Court of India directives on School Bus Safety (W.P. Civil No. 13029/1985), Tamil Nadu Motor Vehicles (School Buses) Rules 2012, and Kerala MVD Safe Campus circulars, all educational institutions operating student buses and vans are mandated to execute 100% pre-trip breath alcohol testing for every driver prior to student transit.

To fulfill statutory audit compliance, Nunes Instruments provides an accredited lineup of 14 professional breath alcohol analysers—ranging from rapid non-contact screening batons (<5s check) to advanced models with built-in thermal printers (Model A50), tamper-proof facial recognition cameras (Model AT-9000), and GPS coordinate logging (Model AT-8900).

Institutions are entitled to special educational rate subsidies (up to 35% discount) and complimentary on-campus driver safety demonstrations.

${getVerbatimLocationsEmail()}`;

      emailSubject = `Official Circular & Lead Quotation: Mandatory School Bus Driver Breath Alcohol Screening Compliance (AY 2026-27) - Nunes Instruments`;
      
      emailBody = `Respected Principal / Correspondent / Transport Coordinator,
{{School_Name}} (UDISE: {{UDISE_Code}}),
{{Block}}, {{Taluk}}.

Greetings from Nunes Instruments, Coimbatore.

Under Supreme Court transport guidelines and State Motor Vehicles Rules, all schools across Tamil Nadu and Kerala are required to conduct compulsory pre-trip breath alcohol screening for school bus and van drivers to ensure 100% student safety.

Nunes Instruments presents our certified 14-Model Breath Alcohol Analyser series engineered specifically for institutional campuses and transport fleet compliance:

★ KEY INSTITUTIONAL HIGHLIGHTS:
1. Model AT-9000 (Supreme Court Gold Standard): Built-in Camera for facial photo proof of the driver during testing + Built-in Thermal Slip Printer for date/time/BAC evidential receipts.
2. Model A50 Rugged Handheld: Fuel-cell electrochemical sensor with integrated thermal printer and 20,000 audit records.
3. Model AT-8900: Detachable thermal printer + GPS coordinate tagging on every test record.
4. Rapid Screening Batons (Non-Contact): 3-5 cm distance screening in under 5 seconds—test 40 drivers in 5 minutes at the morning gate without mouthpieces!

★ INSTITUTIONAL LEAD CONVERSION & COMPLIANCE OFFER:
• Complimentary On-Campus Demonstration & Safety Audit for your fleet.
• Up to 35% Educational Subsidy on institutional bulk orders.
• NABL-traceable annual calibration certificate included with every device.
• 1-Year Comprehensive Replacement Warranty & On-Site Service.

Online Catalogue & Technical Specifications:
${NUNES_CATALOGUE_NETLIFY_URL}

To book a free on-campus demonstration or request an official rate quotation:
WhatsApp Hotline: +91 89409 44000 (Click: https://wa.me/918940944000?text=Interested%20in%20School%20Bus%20Breath%20Analyser%20Quote)
Direct Call: +91 89409 33000 | Landline: +91 0422 2499444
Email: info@nunesinstruments.com

${getVerbatimLocationsEmail()}

Warm regards,
Educational Transport Safety Division
Nunes Instruments, Coimbatore
Web: https://nunesinstruments.com | ${NUNES_CATALOGUE_NETLIFY_URL}`;

      whatsappBody = `🚨 *URGENT MANDATE: SCHOOL BUS DRIVER ALCOHOL SCREENING (AY 2026-27)*
*From: Nunes Instruments, Coimbatore*

Dear Correspondent / Principal, *{{School_Name}}*,

As per Supreme Court & State Transport Department guidelines, daily pre-trip alcohol screening for all school bus drivers is strictly mandatory.

🛡️ *NUNES ACCREDITED BREATH ANALYSERS (14 MODELS):*
📸 *Model AT-9000*: Built-in Camera for driver photo proof + Built-in Thermal Slip Printer.
🖨️ *Model A50*: Fuel-cell sensor + Instant thermal printed receipts (20,000 test logs).
📍 *Model AT-8900*: GPS coordinate tagging + Detachable thermal printer.
⚡ *Rapid Screening Baton*: Non-contact test in <5 seconds. Screen 40 drivers in 5 mins!

🎁 *INSTITUTIONAL SPECIAL OFFER:*
✅ Up to 35% Educational Subsidy Discount.
✅ Free On-Campus Driver Fleet Safety Audit & Live Demo.
✅ 1-Year Comprehensive Replacement Warranty + Calibration Certificate.

📲 *View Full 14-Model Catalogue:*
${NUNES_CATALOGUE_NETLIFY_URL}

${getVerbatimLocationsWhatsApp()}

💬 *To Book Free On-Campus Demo or Request Official Quote:*
Reply directly to this message or WhatsApp: https://wa.me/918940944000?text=Interested%20in%20School%20Bus%20Breath%20Analyser%20Quote`;

    } else if (textLower.includes('lab') || textLower.includes('science') || textLower.includes('physics') || textLower.includes('chemistry') || textLower.includes('stem')) {
      title = 'Annual Science Laboratory Precision Apparatus & Sensor Audit (AY 2026-27)';
      refNumber = `NUNES/EDU/LAB/2026/CIRC-${randNum}`;
      subject = 'Mandatory Calibration & Inventory Verification of Higher Secondary Science Lab Instruments';
      targetGroup = 'Higher Secondary & Secondary Schools';

      bodyText = `To The Principals and Science Faculty Heads,
Higher Secondary Institutions, Tamil Nadu & Kerala.

Subject: Annual Precision Metrology & Laboratory Equipment Audit for Physics, Chemistry & Biology Laboratories (2026-27).

In accordance with State School Education Department directives, all higher secondary and vocational institutions must audit their laboratory instrumentation—including analytical electronic balances, spectrometers, cathode ray oscilloscopes, digital multimeters, and microscope optics.

Nunes Instruments provides NABL-traceable calibration, precision equipment supply, and complimentary on-campus laboratory inspections.

${getVerbatimLocationsEmail()}`;

      emailSubject = `Official Circular: Higher Secondary Science Lab Instrumentation & Calibration Audit (AY 2026-27) - Nunes Instruments`;
      
      emailBody = `Respected Principal / Science Laboratory In-Charge,
{{School_Name}} (UDISE: {{UDISE_Code}}),
{{Block}}, {{Taluk}}.

Greetings from Nunes Instruments Educational Liaison Division.

We are pleased to provide the official circular regarding the Annual Science Laboratory Apparatus & Precision Metrology Audit for Higher Secondary schools across South India.

Please find attached the official circular (Ref: ${refNumber}) and the laboratory verification checklist.

★ INSTITUTIONAL SERVICES AVAILABLE:
• Standard zero-error calibration for electronic balances and spectrometers.
• Supply of certified Physics, Chemistry, Biology & STEM apparatus.
• NABL-traceable calibration certificate for state board practical examination readiness.
• Complimentary on-site technical inspection.

${getVerbatimLocationsEmail()}

Warm regards,
Educational Liaison Team
Nunes Instruments, Coimbatore`;

      whatsappBody = `🔬 *SCIENCE LAB INSTRUMENTATION & CALIBRATION AUDIT (AY 2026-27)*
*From: Nunes Instruments, Coimbatore*

Respected Principal, *{{School_Name}}*,

As per Department of School Education directives, annual precision verification of Physics, Chemistry & Biology laboratory apparatus is scheduled for Higher Secondary institutions.

✅ *NUNES LABORATORY SERVICES:*
• Calibration of analytical balances, spectrometers & optical benches.
• Board practical examination apparatus readiness.
• NABL-traceable calibration certificates.
• Complimentary on-campus equipment health check.

${getVerbatimLocationsWhatsApp()}

💬 *For Lab Audit Assistance:*
WhatsApp: https://wa.me/918940944000?text=Interested%20in%20Science%20Lab%20Audit%20Assistance`;

    } else {
      // General Educational Directive Extracted from PDF
      title = customSubject || `Educational Metrology & Institutional Directives Compliance 2026-27`;
      refNumber = `NUNES/EDU/DIR/2026/CIRC-${randNum}`;
      subject = customSubject || `Official Verification & Educational Infrastructure Standards Protocol`;
      targetGroup = customTarget || 'All South India Schools (21,120 Institutions)';

      bodyText = `To The Principals / Headmasters / Institutional Authorities,
All Educational Institutions, Tamil Nadu & Kerala.

Subject: Official Institutional Directive & Public Infrastructure Protocol (AY 2026-27).

${extractedText ? extractedText.slice(0, 500) + '...' : 'Please review the attached official circular and directives from the educational metrology liaison desk regarding statutory verification standards and institutional safety protocols.'}

Kindly review the directives and submit your institutional acknowledgment sheet within 21 working days.

${getVerbatimLocationsEmail()}`;

      emailSubject = `Official Circular: ${title} - Nunes Instruments`;

      emailBody = `Respected Head of Institution,
{{School_Name}} (UDISE: {{UDISE_Code}}),
{{Block}}, {{Taluk}}.

Greetings from Nunes Instruments Educational Liaison Desk.

Please find enclosed the official circular (${refNumber}) regarding ${subject}.

Directives and submission protocols are outlined in the attached official document. For technical support, please contact our Coimbatore zonal offices.

${getVerbatimLocationsEmail()}

Warm regards,
Educational Liaison Division
Nunes Instruments, Coimbatore`;

      whatsappBody = `📋 *OFFICIAL EDUCATIONAL CIRCULAR: ${title}*
*Reference: ${refNumber}*
*From: Nunes Instruments, Coimbatore*

Respected Principal, *{{School_Name}}*,

Please review the official educational circular regarding ${subject}.

${getVerbatimLocationsWhatsApp()}

💬 *Inquiries:* Reply directly or WhatsApp: https://wa.me/918940944000`;
    }

    const newCircular: CircularItem = {
      id: `circ_${Date.now().toString().slice(-6)}`,
      title,
      reference_number: refNumber,
      circular_date: new Date().toISOString().split('T')[0],
      subject,
      body_text: bodyText,
      extracted_text: extractedText.slice(0, 1000) || `${title}. Reference: ${refNumber}. Automatically scanned and extracted from ${fileName}.`,
      attachment_name: fileName,
      attachment_type: 'application/pdf',
      attachment_size_kb: fileSizeKb,
      generated_email_subject: emailSubject,
      generated_email_body: emailBody,
      generated_whatsapp_body: whatsappBody,
      catalogue_url: isBreathAnalyser ? NUNES_CATALOGUE_NETLIFY_URL : undefined,
      lead_generation_campaign: isBreathAnalyser,
      status: 'APPROVED',
      created_at: new Date().toISOString(),
      approved_by: 'Automated AI Metrology Scanner',
      approved_at: new Date().toISOString(),
      target_group: targetGroup,
      eligible_count: 21120,
      email_ready_count: 17364
    };

    return NextResponse.json({
      success: true,
      message: 'PDF scanned and circular generated successfully',
      circular: newCircular,
      extracted_metrics: {
        file_name: fileName,
        file_size_kb: fileSizeKb,
        extracted_characters: extractedText.length,
        lead_campaign_activated: isBreathAnalyser,
        anti_ban_whatsapp_ready: true,
        locations_included: 3
      }
    });

  } catch (err: any) {
    console.error('Error in /api/circulars/scan-pdf:', err);
    return NextResponse.json({ error: err.message || 'Failed to scan PDF and generate circular' }, { status: 500 });
  }
}
