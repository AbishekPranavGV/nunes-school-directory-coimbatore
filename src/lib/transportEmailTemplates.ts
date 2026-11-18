import { 
  OFFICIAL_CIRCULAR_DRIVE_LINK,
  GMAIL_SENDER,
  NUNES_INTERNAL_BCC_EMAILS
} from '@/lib/data/circularConstants';

export interface TransportEmailTemplateParams {
  circularTitle: string;
  refNo: string;
  category?: string;
  targetAudience?: string;
  companyName?: string;
  recipientName?: string;
  recipientDesignation?: string;
  cityHub?: string;
  district?: string;
  state?: string;
  bodyText?: string;
  attachmentName?: string;
  driveLink?: string;
  catalogueUrl?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  issuingAuthority?: string;
}

export const DEFAULT_CATALOGUE_NETLIFY_URL = 'https://darling-torrone-c0aaf9.netlify.app/';

/**
 * Generates the most advanced, enterprise-grade responsive HTML email template
 * compatible with Gmail, Outlook, Apple Mail, and modern mobile clients.
 */
export function generateExecutiveTransportHtml(params: TransportEmailTemplateParams): string {
  const title = params.circularTitle || 'Mandatory Commercial & School Fleet Driver Breath Alcohol Screening Compliance';
  const refNo = params.refNo || 'NUNES/TR/2026/089';
  const driveLink = params.driveLink || OFFICIAL_CIRCULAR_DRIVE_LINK;
  const catalogueUrl = params.catalogueUrl || DEFAULT_CATALOGUE_NETLIFY_URL;
  const attachmentName = params.attachmentName || 'Nunes_Breath_Analyser_Catalogue_14_Models_2026.pdf';
  const signatoryName = params.signatoryName || 'Er. K. R. Senthil Kumar, B.E., M.I.E.';
  const signatoryTitle = params.signatoryTitle || 'Director of Technical Services & Metrology Standards';
  const issuingAuthority = params.issuingAuthority || 'Nunes Instruments — Fleet Safety & Precision Metrology Directorate';

  const company = params.companyName || 'Registered Transport Fleet Operator';
  const contact = params.recipientName 
    ? `${params.recipientName} (${params.recipientDesignation || 'Managing Director / Fleet Safety Officer'})`
    : 'Managing Director / Fleet Safety Officer / Depot Controller';
  const location = params.cityHub || params.district 
    ? `${params.cityHub || params.district}, ${params.state || 'Tamil Nadu & Kerala'}`
    : 'South India Corridors (Tamil Nadu & Kerala)';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} - Nunes Instruments</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;-webkit-font-smoothing:antialiased;">
  
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);border:1px solid #334155;">
    
    <!-- 1. TOP EXECUTIVE BRAND BANNER -->
    <div style="background:linear-gradient(135deg, #020617 0%, #0c1f38 45%, #0369a1 100%);padding:36px 28px;text-align:center;color:#ffffff;position:relative;">
      
      <div style="display:inline-block;padding:5px 14px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);border-radius:24px;font-size:10.5px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#7dd3fc;margin-bottom:14px;">
        ★ NUNES INSTRUMENTATION • PRECISION METROLOGY & FLEET SAFETY
      </div>
      
      <div style="display:inline-block;background:#059669;color:#ffffff;font-size:10px;font-weight:800;padding:4px 10px;border-radius:12px;margin-left:6px;text-transform:uppercase;letter-spacing:0.5px;">
        TLS 1.3 VERIFIED • 0% BAN RISK
      </div>

      <h1 style="margin:14px 0 8px 0;font-size:22px;line-height:1.35;font-weight:900;color:#ffffff;letter-spacing:-0.3px;">
        ${title}
      </h1>

      <p style="margin:0 auto;font-size:13px;color:#bae6fd;line-height:1.55;max-width:560px;">
        Accredited 14-Model Alcohol Breath Analyser Series with Built-in Facial Camera, Thermal Slip Printer & GPS Tagging (AY 2026-27)
      </p>

      <div style="margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.15);font-size:11px;color:#cbd5e1;display:flex;justify-content:center;gap:16px;">
        <span><strong>Ref:</strong> <code style="color:#fde047;background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:4px;">${refNo}</code></span>
        <span>&bull;</span>
        <span><strong>Authority:</strong> Supreme Court & State RTO Fleet Safety Mandate</span>
      </div>

    </div>

    <!-- 2. RECIPIENT FLEET PLAQUE -->
    <div style="background:#f8fafc;padding:18px 28px;border-bottom:1px solid #e2e8f0;">
      <div style="font-size:11px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#0284c7;margin-bottom:4px;">
        TO ALL MANAGING DIRECTORS, FLEET OPERATORS & DEPOT MANAGERS
      </div>
      <div style="font-size:16px;font-weight:900;color:#0f172a;letter-spacing:-0.2px;">
        ${company}
      </div>
      <div style="font-size:12px;color:#64748b;margin-top:2px;">
        <strong>Attention:</strong> ${contact} &bull; <span>${location}</span>
      </div>
    </div>

    <!-- 3. MANDATE DIRECTIVE CALLOUT -->
    <div style="padding:28px 28px 16px 28px;font-size:13.5px;line-height:1.75;color:#334155;">
      
      <div style="background:#fffbeb;border:1px solid #fde68a;border-left:5px solid #d97706;border-radius:10px;padding:14px 18px;margin-bottom:22px;">
        <strong style="color:#92400e;display:block;font-size:12.5px;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.5px;">
          🚨 STATUTORY COMPLIANCE DIRECTIVE (AY 2026-27):
        </strong>
        <span style="color:#78350f;font-size:12.5px;line-height:1.6;">
          Pursuant to Supreme Court Guidelines on Passenger & School Bus Safety, Tamil Nadu Motor Vehicles Rules, and Kerala MVD Safe Transit Directives, <strong>100% pre-trip breath alcohol screening is mandatory</strong> for commercial, school transport, and freight fleet drivers before daily vehicle dispatch.
        </span>
      </div>

      <!-- 4. THREE PRODUCT CATEGORIES CARDS (14 ACCREDITED MODELS) -->
      <div style="margin:24px 0;">
        <div style="font-size:12px;font-weight:900;letter-spacing:1px;color:#0f172a;text-transform:uppercase;margin-bottom:12px;">
          📊 14-MODEL ACCREDITED BREATH ANALYSER SUITE:
        </div>

        <!-- Tier 1: Rapid Screening -->
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:5px solid #10b981;padding:14px 16px;border-radius:10px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;color:#065f46;">
            01 / RAPID NON-CONTACT SCREENING BATONS
          </div>
          <div style="font-size:12px;color:#047857;margin-top:3px;line-height:1.5;">
            <strong>Screen 40 drivers in under 5 minutes!</strong> Fast non-contact funnel testing. Ideal for depot gate entry, shift handovers, and bulk driver queues with flashing red/green traffic baton indicators.
          </div>
        </div>

        <!-- Tier 2: Handheld Digital -->
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-left:5px solid #0284c7;padding:14px 16px;border-radius:10px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;color:#075985;">
            02 / HANDHELD DIGITAL FUEL-CELL ANALYSERS (AT-9000 & A50)
          </div>
          <div style="font-size:12px;color:#0369a1;margin-top:3px;line-height:1.5;">
            High-precision electrochemical fuel cell sensor technology with clear digital LCD readouts. Zero cross-sensitivity to acetone or cigarette smoke.
          </div>
        </div>

        <!-- Tier 3: Evidential Thermal Printer Units -->
        <div style="background:#fefce8;border:1px solid #fef08a;border-left:5px solid #ca8a04;padding:14px 16px;border-radius:10px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;color:#854d0e;">
            03 / EVIDENTIAL RECORDING & THERMAL PRINTING (CAMERA + GPS)
          </div>
          <div style="font-size:12px;color:#713f12;margin-top:3px;line-height:1.5;">
            <strong>Model AT-9000 & AT-8900:</strong> Built-in camera captures driver photo on test completion. Built-in thermal printer issues immediate timestamped test slips with driver ID, GPS location, and BAC reading.
          </div>
        </div>
      </div>

      <!-- 5. ATTACHED PRODUCT CATALOGUE & DIRECTIVE ACTION BOX -->
      <div style="background:linear-gradient(to bottom, #f8fafc, #f1f5f9);border:2px dashed #0284c7;border-radius:14px;padding:22px;text-align:center;margin:26px 0;">
        <div style="font-size:14.5px;font-weight:900;color:#0f172a;margin-bottom:4px;">
          📄 OFFICIAL DIRECTIVE DOCUMENT & PRODUCT CATALOGUE
        </div>
        <div style="font-size:12px;color:#64748b;margin-bottom:16px;">
          ${attachmentName} &bull; Specifications, measurement ranges, and calibration certification.
        </div>
        <div>
          <a href="${driveLink}" target="_blank" style="display:inline-block;padding:12px 22px;background:#0284c7;color:#ffffff;text-decoration:none;font-weight:800;font-size:13px;border-radius:8px;box-shadow:0 4px 14px rgba(2,132,199,0.35);margin:4px;">
            📄 Open Official Directive PDF (Google Drive)
          </a>
          <a href="${catalogueUrl}" target="_blank" style="display:inline-block;padding:12px 20px;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:800;font-size:13px;border-radius:8px;margin:4px;">
            🌐 View Full Online Catalogue (Netlify)
          </a>
        </div>
      </div>

      <!-- 6. DEMO, QUOTATION & CONTACT DESK -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin:24px 0;">
        <div style="font-size:13px;font-weight:900;color:#0f172a;margin-bottom:8px;">
          💬 COMPLIMENTARY ON-SITE DEMO & COMMERCIAL QUOTATION
        </div>
        <div style="font-size:12px;color:#475569;margin-bottom:14px;line-height:1.5;">
          Our technical service engineers provide live on-depot fleet safety demonstrations and calibration audits across South India.
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <a href="https://wa.me/918940944000?text=${encodeURIComponent(`Hello Nunes Instruments, reaching out regarding ${title}. We request a demo/quotation for our fleet.`)}" target="_blank" style="display:inline-block;padding:10px 18px;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:800;font-size:12px;border-radius:6px;">
            💬 WhatsApp Enquiry: +91 89409 44000
          </a>
          <a href="mailto:${GMAIL_SENDER.email}?cc=${GMAIL_SENDER.cc}&subject=${encodeURIComponent(`Quotation Request: ${title}`)}" style="display:inline-block;padding:10px 18px;background:#4338ca;color:#ffffff;text-decoration:none;font-weight:800;font-size:12px;border-radius:6px;">
            ✉️ Email Procurement: ${GMAIL_SENDER.email}
          </a>
        </div>
        <div style="font-size:12px;color:#0f172a;margin-top:14px;font-weight:700;">
          📞 Direct Hotline Numbers: 93452 26022 &bull; 89409 44000 &bull; 89409 33000
        </div>
      </div>

      <!-- 7. THREE COIMBATORE OFFICE LOCATIONS (RESPONSIVE TABLE) -->
      <div style="margin:26px 0;">
        <div style="font-size:12px;font-weight:900;letter-spacing:1px;color:#0284c7;text-transform:uppercase;margin-bottom:12px;">
          📍 COIMBATORE ZONAL HUBS (3 DIRECT LOCATIONS)
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <tr>
            <td style="padding:12px;border:1px solid #cbd5e1;background:#ffffff;vertical-align:top;width:33.3%;">
              <strong style="color:#0f172a;font-size:12px;">01. Rathinapuri Hub</strong><br>
              <span style="color:#64748b;line-height:1.5;display:block;margin-top:4px;">
                11-A, 2nd Cross, Sundarar St, Opp. to LaLa Mahall, Nalvar Layout, Rathinapuri, Coimbatore 641027
              </span>
              <div style="margin-top:6px;font-weight:700;color:#0f172a;">Phone: +91 89409 44000</div>
              <a href="https://maps.google.com/?q=11-A+2nd+Cross+Sundarar+Street+Rathinapuri+Coimbatore" target="_blank" style="color:#0284c7;font-weight:800;text-decoration:none;display:inline-block;margin-top:6px;">
                📍 Get Directions →
              </a>
            </td>
            <td style="padding:12px;border:1px solid #cbd5e1;background:#ffffff;vertical-align:top;width:33.3%;">
              <strong style="color:#0f172a;font-size:12px;">02. Gopalapuram Hub</strong><br>
              <span style="color:#64748b;line-height:1.5;display:block;margin-top:4px;">
                6, GJ Chandran Complex, Head Quarters Rd, Opp. CSI Church, Gopalapuram, Coimbatore 641018
              </span>
              <div style="margin-top:6px;font-weight:700;color:#0f172a;">Phone: +91 89409 33000</div>
              <a href="https://maps.google.com/?q=6+GJ+Chandran+Complex+Head+Quarters+Road+Gopalapuram+Coimbatore" target="_blank" style="color:#0284c7;font-weight:800;text-decoration:none;display:inline-block;margin-top:6px;">
                📍 Get Directions →
              </a>
            </td>
            <td style="padding:12px;border:1px solid #cbd5e1;background:#ffffff;vertical-align:top;width:33.3%;">
              <strong style="color:#0f172a;font-size:12px;">03. Gandhipuram Hub</strong><br>
              <span style="color:#64748b;line-height:1.5;display:block;margin-top:4px;">
                218-628, 1st St, Cross Cut, Gandhipuram, Coimbatore 641012
              </span>
              <div style="margin-top:6px;font-weight:700;color:#0f172a;">Phone: +91 0422 2499444</div>
              <a href="https://maps.google.com/?q=218-628+1st+Street+Cross+Cut+Gandhipuram+Coimbatore" target="_blank" style="color:#0284c7;font-weight:800;text-decoration:none;display:inline-block;margin-top:6px;">
                📍 Get Directions →
              </a>
            </td>
          </tr>
        </table>
      </div>

      <!-- 8. OFFICIAL SIGN-OFF -->
      <div style="border-top:1px solid #e2e8f0;padding-top:18px;margin-top:24px;font-size:12px;color:#475569;">
        <strong style="color:#0f172a;font-size:13px;">Regards,</strong><br>
        <strong style="color:#0284c7;font-size:13px;">${signatoryName}</strong><br>
        <span>${signatoryTitle}</span><br>
        <span style="color:#64748b;">${issuingAuthority}</span>
      </div>

    </div>

    <!-- 9. FOOTER -->
    <div style="background:#0f172a;padding:18px 28px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #1e293b;">
      NUNES INSTRUMENTATION &bull; COIMBATORE, TAMIL NADU &bull; SOUTH INDIA CORRIDORS<br>
      TOBOA, SLOF & KSLOF Certified Fleet Safety Partner &bull; © 2026 Nunes Instruments
    </div>

  </div>

</body>
</html>`;
}

/**
 * Generates structured, high-readability formatted plain text with clean borders
 * for default URL query string parameters.
 */
export function generateStructuredTransportText(params: TransportEmailTemplateParams): string {
  const title = params.circularTitle || 'Mandatory Commercial & School Fleet Driver Breath Alcohol Screening Compliance';
  const refNo = params.refNo || 'NUNES/TR/2026/089';
  const driveLink = params.driveLink || OFFICIAL_CIRCULAR_DRIVE_LINK;
  const catalogueUrl = params.catalogueUrl || DEFAULT_CATALOGUE_NETLIFY_URL;

  return `═══════════════════════════════════════════════════════════════
★ NUNES INSTRUMENTATION — FLEET SAFETY DIRECTIVE (AY 2026-27)
Ref: ${refNo} • TLS 1.3 Verified • NABL Traceable
═══════════════════════════════════════════════════════════════

SUBJECT: ${title}

To All Managing Directors, Fleet Operators, School Bus Correspondents & Depot Controllers,
Commercial Passenger, School Transport, and Logistics Fleets across Tamil Nadu & Kerala.

🚨 MANDATORY STATUTORY DIRECTIVE:
Pursuant to Supreme Court Guidelines on Passenger & School Bus Safety, Tamil Nadu Motor Vehicles Rules, and Kerala MVD Safe Transit Directives, 100% pre-trip breath alcohol screening is mandatory for commercial and institutional vehicle operators before daily dispatch.

📊 14-MODEL ACCREDITED BREATH ANALYSER SERIES:
───────────────────────────────────────────────────────────────
1️⃣ 01 / RAPID SCREENING BATONS:
   • Screen 40 drivers in under 5 minutes!
   • Non-contact testing suitable for depot gate shifts.

2️⃣ 02 / HANDHELD DIGITAL ANALYSERS (Model AT-9000 & A50):
   • Fuel-cell electrochemical sensors with digital LCD readouts.
   • High precision with zero cross-interference.

3️⃣ 03 / EVIDENTIAL RECORDING WITH THERMAL PRINTER (Model AT-8900 / AT-9000):
   • Built-in facial camera captures driver photo proof.
   • Built-in thermal printer issues on-spot test slips with timestamp and GPS coordinate tagging.

📄 OFFICIAL DIRECTIVE & CATALOGUE:
• Online Product Specifications: ${catalogueUrl}
• Cloud Directive Document (Google Drive): ${driveLink}

💬 ENQUIRY, LIVE DEMO & QUOTATION:
• WhatsApp Hotline: +91 89409 44000 (https://wa.me/918940944000)
• Email Procurement: ${GMAIL_SENDER.email} | CC: ${GMAIL_SENDER.cc}
• Direct Contact Numbers: 93452 26022 | 89409 44000 | 89409 33000

📍 OUR 3 COIMBATORE OFFICE LOCATIONS:
───────────────────────────────────────────────────────────────
01. RATHINAPURI HUB:
    11-A, 2nd Cross, Sundarar St, Opp. to LaLa Mahall, Nalvar Layout, Rathinapuri, Coimbatore 641027
    Phone: +91 89409 44000 | Maps: https://maps.google.com/?q=11-A+2nd+Cross+Sundarar+Street+Rathinapuri+Coimbatore

02. GOPALAPURAM HUB:
    6, GJ Chandran Complex, Head Quarters Rd, Opp. CSI Church, Gopalapuram, Coimbatore 641018
    Phone: +91 89409 33000 | Maps: https://maps.google.com/?q=6+GJ+Chandran+Complex+Head+Quarters+Road+Gopalapuram+Coimbatore

03. GANDHIPURAM HUB:
    218-628, 1st St, Cross Cut, Gandhipuram, Coimbatore 641012
    Phone: +91 0422 2499444 / +91 89409 44000 | Maps: https://maps.google.com/?q=218-628+1st+Street+Cross+Cut+Gandhipuram+Coimbatore

═══════════════════════════════════════════════════════════════
Regards,
Er. K. R. Senthil Kumar, B.E., M.I.E.
Director of Technical Services & Metrology Standards
Nunes Instruments — South India Inter-State Transport Directorate
═══════════════════════════════════════════════════════════════`;
}

/**
 * Copies rich styled HTML directly to clipboard using ClipboardItem API
 * so when user presses Ctrl+V in Gmail, it pastes the complete formatted design!
 */
export async function copyStyledHtmlToClipboard(htmlContent: string, plainTextFallback: string): Promise<boolean> {
  try {
    if (typeof window !== 'undefined' && (window as any).ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([plainTextFallback], { type: 'text/plain' });
      const clipboardItem = new (window as any).ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob
      });
      await navigator.clipboard.write([clipboardItem]);
      return true;
    }
  } catch (err) {
    console.warn('ClipboardItem HTML copy failed, falling back to writeText:', err);
  }

  // Fallback
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(htmlContent);
    return true;
  }
  return false;
}
