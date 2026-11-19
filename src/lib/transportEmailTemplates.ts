import { 
  OFFICIAL_CIRCULAR_DRIVE_LINK,
  GMAIL_SENDER,
  NUNES_INTERNAL_BCC_EMAILS
} from '@/lib/data/circularConstants';

export interface TransportEmailTemplateParams {
  circularTitle?: string;
  refNo?: string;
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
  customLogoUrl?: string;
}

export const DEFAULT_CATALOGUE_NETLIFY_URL = 'https://darling-torrone-c0aaf9.netlify.app/';
export const OFFICIAL_CATALOGUE_FILENAME = 'Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf';
export const OFFICIAL_CATALOGUE_FILE_PATH = '/attachments/Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf';
export const OFFICIAL_LOGO_URL = 'https://nunes-transport.vercel.app/images/nunes_logo_transparent.png';

/**
 * NUNES INSTRUMENTATION PREMIUM CIRCULAR EMAIL V3.0
 * 
 * Strict 11-Section Layout:
 * 1. Official NUNES Logo & Clean White Letterhead
 * 2. Main Circular Heading
 * 3. Personalised Institution Details
 * 4. Professional Salutation
 * 5. Short Company Introduction
 * 6. Breath Analyser Product Overview (5 portfolio points)
 * 7. Institutional Applications
 * 8. Attached Product Catalogue Card (Compact horizontal card)
 * 9. Primary Call to Action (Two clear buttons: Corporate Blue & White Outline)
 * 10. Company Contact Information & Signature
 * 11. Unsubscribe and Compliance Footer
 * 
 * Brand Colors:
 * - Primary Navy: #092C55
 * - Corporate Blue: #087EC1
 * - Cyan Accent: #19B5E5
 * - Background: #F4F7FB
 * - Main Text: #243247
 * - White: #FFFFFF
 */
export function generateExecutiveTransportHtml(params: TransportEmailTemplateParams): string {
  const title = params.circularTitle || 'Breath Analyser Solutions for Institutional & Transport Safety';
  const subtitle = 'Explore our range of 14 alcohol breath analyser models for institutional, workplace and transport applications.';
  const refNo = params.refNo || 'NUNES/INST/SAFETY/2026/014';
  const driveLink = params.driveLink || OFFICIAL_CIRCULAR_DRIVE_LINK;
  const catalogueUrl = params.catalogueUrl || DEFAULT_CATALOGUE_NETLIFY_URL;
  const attachmentName = params.attachmentName || OFFICIAL_CATALOGUE_FILENAME;
  const logoUrl = params.customLogoUrl || OFFICIAL_LOGO_URL;

  // Institution personalisation with safe fallback
  const institutionName = params.companyName && params.companyName !== 'Registered Transport Fleet Operator'
    ? params.companyName
    : (params.recipientName || 'Educational Institution / Transport Fleet Operator');
  const attention = params.recipientDesignation || 'The Principal / Administrative Officer / Transport Department';
  const locationDistrict = params.cityHub || params.district || 'Coimbatore';
  const locationState = params.state || 'Tamil Nadu';

  const quotationMailto = `mailto:info@nunesinstrumentation.com?cc=${GMAIL_SENDER.email}&subject=${encodeURIComponent(`Quotation / Demonstration Request: ${title} - ${institutionName}`)}&body=${encodeURIComponent(
`Respected NUNES Instrumentation Team,

We would like to request an official commercial quotation and schedule a product demonstration for your 14-Model Breath Analyser series.

Institution Name: ${institutionName}
Designation / Dept: ${attention}
Location: ${locationDistrict}, ${locationState}
Contact Phone: 
Preferred Models / Requirements: (Portable / Rapid Screening Baton / Thermal Printer Model)

Looking forward to your prompt response.

Regards,
${institutionName}`
  )}`;

  const contactMailto = `mailto:info@nunesinstrumentation.com?cc=${GMAIL_SENDER.email}&subject=${encodeURIComponent(`Institutional Enquiry: ${title}`)}`;

  const whatsAppUrl = `https://wa.me/918940944000?text=${encodeURIComponent(`Hello NUNES Instrumentation, reaching out regarding ${title} for ${institutionName}. We request product information/quotation.`)}`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title} - NUNES Instrumentation</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #F4F7FB;
      font-family: Arial, Helvetica, sans-serif;
      color: #243247;
      line-height: 1.6;
    }
    @media only screen and (max-width: 640px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .responsive-column {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .mobile-padding {
        padding-left: 18px !important;
        padding-right: 18px !important;
      }
      .mobile-heading {
        font-size: 20px !important;
        line-height: 1.35 !important;
      }
      .mobile-stack-center {
        text-align: left !important;
        margin-top: 12px !important;
      }
      .attachment-btn-cell {
        display: block !important;
        width: 100% !important;
        text-align: left !important;
        padding-top: 10px !important;
      }
      .cta-btn-block {
        display: block !important;
        width: 100% !important;
        margin-bottom: 10px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:24px 0;background-color:#F4F7FB;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- OUTER WRAPPER TABLE -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F4F7FB;table-layout:fixed;">
    <tr>
      <td align="center" style="padding:0 12px;">

        <!-- MAIN CARD (640-680px) -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="email-container" style="max-width:660px;margin:0 auto;background-color:#FFFFFF;border:1px solid #D9E2EC;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(9,44,85,0.06);">
          
          <!-- ============================================================== -->
          <!-- 1. OFFICIAL NUNES LOGO & LETTERHEAD                            -->
          <!-- ============================================================== -->
          <tr>
            <td style="background-color:#FFFFFF;padding:24px 32px 18px 32px;" class="mobile-padding">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle" style="width:55%;">
                    <a href="https://www.nunesinstrumentation.com" target="_blank" style="text-decoration:none;display:inline-block;">
                      <img src="${logoUrl}" alt="NUNES INSTRUMENTATION" width="168" style="display:block;border:0;outline:none;max-width:180px;height:auto;" />
                    </a>
                  </td>
                  <td align="right" valign="middle" style="width:45%;font-size:11px;color:#475569;line-height:1.45;text-align:right;">
                    <div style="font-weight:bold;color:#092C55;font-size:12px;letter-spacing:0.3px;">NUNES INSTRUMENTATION</div>
                    <div>Coimbatore, Tamil Nadu, India</div>
                    <div><a href="tel:+918940944000" style="color:#087EC1;text-decoration:none;font-weight:bold;">+91 8940944000</a></div>
                    <div><a href="mailto:info@nunesinstrumentation.com" style="color:#087EC1;text-decoration:none;">info@nunesinstrumentation.com</a></div>
                  </td>
                </tr>
              </table>
              <!-- Subtle Navy-Blue Separator Line with Cyan Accent -->
              <div style="border-top:2px solid #092C55;border-bottom:1px solid #19B5E5;margin-top:16px;width:100%;"></div>
            </td>
          </tr>

          <!-- ============================================================== -->
          <!-- 2. MAIN CIRCULAR HEADING                                       -->
          <!-- ============================================================== -->
          <tr>
            <td style="background-color:#F4F7FB;padding:22px 32px;border-bottom:1px solid #E2E8F0;" class="mobile-padding">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="left">
                    <div style="font-size:11px;font-weight:bold;color:#087EC1;border-left:3px solid #19B5E5;padding-left:8px;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;">
                      Official Safety Circular • Ref: ${refNo}
                    </div>
                    <h1 class="mobile-heading" style="margin:0 0 8px 0;font-size:23px;font-weight:bold;color:#092C55;line-height:1.35;font-family:Arial,Helvetica,sans-serif;">
                      ${title}
                    </h1>
                    <p style="margin:0;font-size:14.5px;color:#475569;line-height:1.5;">
                      ${subtitle}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================== -->
          <!-- 3. PERSONALISED INSTITUTION DETAILS                             -->
          <!-- ============================================================== -->
          <tr>
            <td style="background-color:#FFFFFF;padding:18px 32px;border-bottom:1px solid #EEF2F6;" class="mobile-padding">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #087EC1;border-radius:6px;">
                <tr>
                  <td style="padding:14px 18px;font-size:13px;line-height:1.6;color:#243247;">
                    <div style="font-weight:bold;color:#092C55;font-size:14px;">
                      To: ${institutionName}
                    </div>
                    <div style="color:#475569;">
                      <strong>Attention:</strong> ${attention}
                    </div>
                    <div style="color:#475569;">
                      <strong>Location:</strong> ${locationDistrict}, ${locationState}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================== -->
          <!-- 4, 5, 6, 7. BODY CONTENT & PRODUCT OVERVIEW                   -->
          <!-- ============================================================== -->
          <tr>
            <td style="background-color:#FFFFFF;padding:24px 32px 16px 32px;font-size:14.5px;line-height:1.65;color:#243247;" class="mobile-padding">
              
              <!-- 4. Salutation -->
              <p style="margin:0 0 16px 0;font-size:15px;font-weight:bold;color:#092C55;">
                Respected Sir/Madam,
              </p>

              <!-- 5. Short Company Introduction -->
              <p style="margin:0 0 14px 0;">
                Greetings from NUNES Instrumentation, Coimbatore.
              </p>
              <p style="margin:0 0 18px 0;">
                We are pleased to introduce our range of Alcohol Breath Analysers for preliminary alcohol screening and safety-monitoring applications across educational institutions, workplaces and transport operations.
              </p>

              <!-- 6. Breath Analyser Product Overview -->
              <p style="margin:0 0 10px 0;font-weight:bold;color:#092C55;">
                Our product portfolio includes:
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 18px 0;">
                <tr>
                  <td style="padding:4px 0 4px 12px;font-size:14px;color:#243247;">
                    <span style="color:#087EC1;font-weight:bold;margin-right:8px;">•</span> Portable and handheld breath analysers
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0 4px 12px;font-size:14px;color:#243247;">
                    <span style="color:#087EC1;font-weight:bold;margin-right:8px;">•</span> Rapid screening and non-contact screening devices
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0 4px 12px;font-size:14px;color:#243247;">
                    <span style="color:#087EC1;font-weight:bold;margin-right:8px;">•</span> Digital testers with LCD displays
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0 4px 12px;font-size:14px;color:#243247;">
                    <span style="color:#087EC1;font-weight:bold;margin-right:8px;">•</span> Professional models with integrated or external printing
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0 4px 12px;font-size:14px;color:#243247;">
                    <span style="color:#087EC1;font-weight:bold;margin-right:8px;">•</span> Advanced devices with data storage and reporting features
                  </td>
                </tr>
              </table>

              <!-- 7. Institutional Applications -->
              <p style="margin:0 0 16px 0;">
                These solutions may assist with driver screening, institutional transport procedures and workplace safety initiatives, subject to applicable policies and requirements.
              </p>
              
              <p style="margin:0 0 20px 0;">
                Please find attached our 16-page Breath Analyser Product Catalogue, featuring 14 product models, specifications and QR codes.
              </p>

            </td>
          </tr>

          <!-- ============================================================== -->
          <!-- 8. ATTACHED PRODUCT CATALOGUE CARD (Compact Horizontal Card)   -->
          <!-- ============================================================== -->
          <tr>
            <td style="background-color:#FFFFFF;padding:0 32px 24px 32px;" class="mobile-padding">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F4F7FB;border:1px solid #CFDFEE;border-radius:8px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <!-- Left: Red PDF Icon -->
                        <td valign="middle" style="width:48px;padding-right:14px;">
                          <div style="width:42px;height:42px;background-color:#EF4444;border-radius:8px;text-align:center;line-height:42px;color:#FFFFFF;font-weight:bold;font-size:12px;letter-spacing:0.5px;">
                            PDF
                          </div>
                        </td>
                        <!-- Center: Catalogue Details -->
                        <td valign="middle" align="left" style="font-size:13px;line-height:1.45;">
                          <div style="font-weight:bold;color:#092C55;font-size:14px;">
                            Breath Analyser Product Catalogue
                          </div>
                          <div style="color:#64748b;font-size:12px;margin-top:2px;">
                            14 Product Models | 16 Pages | PDF (5.16 MB)
                          </div>
                        </td>
                        <!-- Right: Actions -->
                        <td valign="middle" align="right" class="attachment-btn-cell" style="padding-left:12px;white-space:nowrap;">
                          <a href="${driveLink}" target="_blank" style="display:inline-block;padding:8px 16px;background-color:#087EC1;color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:12px;border-radius:6px;margin:2px;">
                            Preview PDF
                          </a>
                          <a href="${catalogueUrl}" target="_blank" style="display:inline-block;padding:8px 14px;background-color:#FFFFFF;color:#092C55;border:1px solid #CBD5E1;text-decoration:none;font-weight:bold;font-size:12px;border-radius:6px;margin:2px;">
                            Online View
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================== -->
          <!-- 9. PRIMARY CALL TO ACTION (Exactly Two Clear Actions)           -->
          <!-- ============================================================== -->
          <tr>
            <td style="background-color:#FFFFFF;padding:0 32px 24px 32px;" class="mobile-padding">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#FFFFFF;border-top:1px solid #EEF2F6;padding-top:20px;">
                <tr>
                  <td align="left">
                    <p style="margin:0 0 16px 0;font-size:14px;color:#243247;">
                      For product information, demonstrations, quotations or institutional requirements, our team would be pleased to assist.
                    </p>
                    
                    <!-- Two Buttons in Clean Responsive Alignment -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px 0;">
                      <tr>
                        <!-- Primary Button: Corporate Blue -->
                        <td align="left" class="cta-btn-block" style="padding-right:12px;">
                          <a href="${quotationMailto}" target="_blank" style="display:inline-block;padding:12px 22px;background-color:#087EC1;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:13.5px;font-weight:bold;text-decoration:none;border-radius:6px;text-align:center;">
                            Request a Quotation / Demonstration
                          </a>
                        </td>
                        <!-- Secondary Button: White Outline -->
                        <td align="left" class="cta-btn-block">
                          <a href="${contactMailto}" target="_blank" style="display:inline-block;padding:11px 20px;background-color:#FFFFFF;color:#092C55;border:1.5px solid #092C55;font-family:Arial,Helvetica,sans-serif;font-size:13.5px;font-weight:bold;text-decoration:none;border-radius:6px;text-align:center;">
                            Contact NUNES Instrumentation
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Optional WhatsApp Contact as Small Text Link -->
                    <div style="font-size:12px;color:#64748b;margin-top:8px;">
                      Prefer WhatsApp? Chat directly with our institutional desk: 
                      <a href="${whatsAppUrl}" target="_blank" style="color:#087EC1;font-weight:bold;text-decoration:none;margin-left:4px;">
                        +91 8940944000
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================== -->
          <!-- 10. COMPANY SIGNATURE & CONTACT INFORMATION                   -->
          <!-- ============================================================== -->
          <tr>
            <td style="background-color:#FFFFFF;padding:0 32px 28px 32px;font-size:13.5px;line-height:1.6;color:#243247;" class="mobile-padding">
              <div style="margin-bottom:16px;">
                Warm regards,<br />
                <strong style="color:#092C55;">Sales &amp; Institutional Support Team</strong><br />
                <span>NUNES Instrumentation</span><br />
                <span style="color:#64748b;">Coimbatore, Tamil Nadu</span>
              </div>

              <!-- Formal Company Signature Block -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid #E2E8F0;padding-top:16px;">
                <tr>
                  <td style="font-size:12px;line-height:1.6;color:#475569;">
                    <div style="font-weight:bold;color:#092C55;font-size:13px;letter-spacing:0.5px;text-transform:uppercase;">
                      NUNES INSTRUMENTATION
                    </div>
                    <div style="color:#64748b;font-size:11.5px;margin-bottom:6px;">
                      Industrial | Laboratory | Testing | Measuring | Process Instruments<br />
                      Sales • Service • Repairs • Calibration
                    </div>
                    <div>Coimbatore, Tamil Nadu, India</div>
                    <div>
                      Phone: <a href="tel:+918940944000" style="color:#087EC1;text-decoration:none;font-weight:bold;">+91 8940944000</a> / <a href="tel:+918940933000" style="color:#087EC1;text-decoration:none;font-weight:bold;">+91 8940933000</a>
                    </div>
                    <div>
                      Email: <a href="mailto:info@nunesinstrumentation.com" style="color:#087EC1;text-decoration:none;">info@nunesinstrumentation.com</a>
                    </div>
                    <div>
                      Website: <a href="https://www.nunesinstrumentation.com" target="_blank" style="color:#087EC1;text-decoration:none;font-weight:bold;">www.nunesinstrumentation.com</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================== -->
          <!-- 11. UNSUBSCRIBE AND COMPLIANCE FOOTER                          -->
          <!-- ============================================================== -->
          <tr>
            <td style="background-color:#F4F7FB;padding:18px 32px;text-align:center;font-size:11px;color:#64748b;border-top:1px solid #E2E8F0;" class="mobile-padding">
              <p style="margin:0 0 6px 0;line-height:1.5;">
                This institutional safety circular was transmitted to institutional correspondents and transport safety administrators for informational and compliance purposes.
              </p>
              <p style="margin:0;line-height:1.5;">
                To update your communication preferences or opt out, please 
                <a href="mailto:info@nunesinstrumentation.com?subject=${encodeURIComponent(`Unsubscribe Safety Circular - ${institutionName}`)}" style="color:#087EC1;text-decoration:underline;">
                  Unsubscribe
                </a>.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Generates clean plain text fallback for email clients that do not support HTML
 */
export function generateStructuredTransportText(params: TransportEmailTemplateParams): string {
  const title = params.circularTitle || 'Breath Analyser Solutions for Institutional & Transport Safety';
  const refNo = params.refNo || 'NUNES/INST/SAFETY/2026/014';
  const institutionName = params.companyName || params.recipientName || 'Educational Institution / Transport Fleet Operator';
  const attention = params.recipientDesignation || 'The Principal / Administrative Officer / Transport Department';
  const locationDistrict = params.cityHub || params.district || 'Coimbatore';
  const locationState = params.state || 'Tamil Nadu';
  const driveLink = params.driveLink || OFFICIAL_CIRCULAR_DRIVE_LINK;
  const catalogueUrl = params.catalogueUrl || DEFAULT_CATALOGUE_NETLIFY_URL;

  return `NUNES INSTRUMENTATION
Coimbatore, Tamil Nadu, India
Phone: +91 8940944000 / +91 8940933000
Email: info@nunesinstrumentation.com
Website: www.nunesinstrumentation.com
--------------------------------------------------------------------------------

Ref: ${refNo}
SUBJECT: ${title}

To: ${institutionName}
Attention: ${attention}
Location: ${locationDistrict}, ${locationState}

Respected Sir/Madam,

Greetings from NUNES Instrumentation, Coimbatore.

We are pleased to introduce our range of Alcohol Breath Analysers for preliminary alcohol screening and safety-monitoring applications across educational institutions, workplaces and transport operations.

Our product portfolio includes:
• Portable and handheld breath analysers
• Rapid screening and non-contact screening devices
• Digital testers with LCD displays
• Professional models with integrated or external printing
• Advanced devices with data storage and reporting features

These solutions may assist with driver screening, institutional transport procedures and workplace safety initiatives, subject to applicable policies and requirements.

Please find attached our 16-page Breath Analyser Product Catalogue, featuring 14 product models, specifications and QR codes.

Online Catalogue: ${catalogueUrl}
Official Directive PDF: ${driveLink}

For product information, demonstrations, quotations or institutional requirements, our team would be pleased to assist.

Primary Actions:
1. Request a Quotation / Demonstration: info@nunesinstrumentation.com
2. WhatsApp Desk: +91 8940944000 (https://wa.me/918940944000)

Warm regards,
Sales & Institutional Support Team
NUNES Instrumentation
Coimbatore, Tamil Nadu

NUNES INSTRUMENTATION
Industrial | Laboratory | Testing | Measuring | Process Instruments
Sales • Service • Repairs • Calibration
Coimbatore, Tamil Nadu, India
Phone: +91 8940944000 / +91 8940933000
Email: info@nunesinstrumentation.com
Website: www.nunesinstrumentation.com

To update communication preferences or unsubscribe, please email info@nunesinstrumentation.com with subject "Unsubscribe".`;
}

/**
 * Copies rich styled HTML directly to clipboard using ClipboardItem API
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

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(htmlContent);
    return true;
  }
  return false;
}
