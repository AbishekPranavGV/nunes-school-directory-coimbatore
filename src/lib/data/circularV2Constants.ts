import { CircularV2Attachment, CircularV2Template } from '@/types/circular';
import { NUNES_INTERNAL_BCC_EMAILS, NUNES_INTERNAL_BCC_MEMBERS } from './circularConstants';

export const NUNES_INTERNAL_BCC_LIST = NUNES_INTERNAL_BCC_EMAILS;

export const EXACT_CATALOGUE_PDF: CircularV2Attachment = {
  id: 'att_breath_analyser_final',
  filename: 'Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf',
  originalName: 'Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf',
  urlPath: '/attachments/Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf',
  localPath: 'public/attachments/Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf',
  sizeBytes: 5410301,
  sizeFormatted: '5.16 MB',
  pageCount: 16,
  sha256Checksum: 'CD09281107EC3CE075D24897E06B0BC08B2BED444E87751810025D1C495451A1',
  version: '2.0.4-Final',
  description: 'NUNES 14-Model Breath Analyser Full Suite Catalogue featuring individual product specifications, high-resolution device photographs, measurement ranges, and QR verification codes across all 16 pages.',
  isVerified: true,
  uploadedAt: '2026-11-18T16:33:03.000Z'
};

export const NUNES_OFFICIAL_CONTACTS = {
  companyName: 'NUNES INSTRUMENTATION',
  headquarters: 'Coimbatore, Tamil Nadu',
  primaryEmail: 'info@nunesinstrumentation.com',
  dispatchEmail: 'nunesalcotest@gmail.com',
  ccEmail: 'nunescbe@gmail.com',
  phone1: '8940944000',
  phone2: '8940933000',
  phoneLandline: '0422-2499444',
  websiteUrl: 'https://www.nunesinstrumentation.com',
  catalogueOnlineUrl: 'https://darling-torrone-c0aaf9.netlify.app/',
  drivePdfLink: 'https://drive.google.com/file/d/1PgEWdCogcIsrZ3Xv9q6NdDtRhgL8bSeF/view?usp=sharing',
  bccCoordinators: NUNES_INTERNAL_BCC_EMAILS,
  bccMembers: NUNES_INTERNAL_BCC_MEMBERS,
  locations: [
    {
      id: 'cbe-rathinapuri',
      title: '01. Rathinapuri Zonal Hub',
      address: '11-A, 2nd Cross, Sundarar Street, Opp. to LaLa Mahall, Nalvar Layout, Rathinapuri, Coimbatore 641027',
      phone: '+91 89409 44000',
      mapsUrl: 'https://maps.google.com/?q=11-A+2nd+Cross+Sundarar+Street+Rathinapuri+Coimbatore'
    },
    {
      id: 'cbe-gopalapuram',
      title: '02. Gopalapuram Corporate Office',
      address: '6, GJ Chandran Complex, Head Quarters Road, Opp. CSI Church, Gopalapuram, Coimbatore 641018',
      phone: '+91 89409 33000',
      mapsUrl: 'https://maps.google.com/?q=6+GJ+Chandran+Complex+Head+Quarters+Road+Gopalapuram+Coimbatore'
    },
    {
      id: 'cbe-gandhipuram',
      title: '03. Gandhipuram Calibration Depot',
      address: '218-628, 1st Street, Cross Cut, Gandhipuram, Coimbatore 641012',
      phone: '+91 0422 2499444',
      mapsUrl: 'https://maps.google.com/?q=218-628+1st+Street+Cross+Cut+Gandhipuram+Coimbatore'
    }
  ]
};

export const PREBUILT_CIRCULAR_TEMPLATES: CircularV2Template[] = [
  {
    id: 'tpl_breath_analyser_intro',
    name: 'Breath Analyser Product Introduction (14 Models)',
    category: 'Breath Analyser Introduction',
    badge: 'Default Official Campaign',
    title: 'Breath Analyser Solutions for Institutional & Transport Safety',
    referenceNumber: 'NUNES/INST/SAFETY/2026/014',
    targetAudience: 'To The Principal / Administrative Officer / Transport Department',
    subject: 'Breath Analyser Solutions for Institutional & Transport Safety',
    body: `Respected Sir/Madam,

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

For product information, demonstrations, quotations or institutional requirements, our team would be pleased to assist.

Warm regards,
Sales & Institutional Support Team
NUNES Instrumentation
Coimbatore, Tamil Nadu`,
    attachmentName: 'Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf',
    attachmentSizeBytes: 5410301,
    attachmentPages: 16,
    driveLink: NUNES_OFFICIAL_CONTACTS.drivePdfLink,
    catalogueUrl: NUNES_OFFICIAL_CONTACTS.catalogueOnlineUrl,
    isDefault: true
  },
  {
    id: 'tpl_school_transport_safety',
    name: 'School Transport Safety & Mandatory Driver Screening',
    category: 'Transport Safety',
    badge: 'Statutory Compliance',
    title: 'Mandatory Driver Alcohol Screening Protocol for Institutional Transport Fleets',
    referenceNumber: 'NUNES/TR/MANDATE/2026/089',
    targetAudience: 'To The Transport In-Charge / Fleet Manager / Head of School',
    subject: 'School Transport Safety: Implementation of Mandatory Pre-Trip Driver Alcohol Screening',
    body: `To
The Transport In-Charge / Fleet Manager / Head of School

Subject: School Transport Safety: Implementation of Mandatory Pre-Trip Driver Alcohol Screening

Respected Sir/Madam,

Pursuant to Supreme Court Guidelines on Student Transport Safety and State Motor Vehicles Regulations, educational institutions operating buses and transport vans are advised to establish comprehensive pre-trip alcohol screening routines for all drivers.

NUNES Instrumentation offers specialized rapid-screening and evidential breath alcohol testing equipment:
• Rapid-screening traffic batons: Screen 40 drivers in under 5 minutes at morning depot gates.
• Model A50 & AT-9000: Integrated thermal printer generating evidential test slips with timestamp and driver identification.
• NABL-traceable calibration certification and comprehensive on-site service support.

We provide complimentary on-campus demonstration of all units and assist in setting up an institutional driver safety checkpoint.

Enclosed: 16-page official product catalogue (14 Models) with QR codes.

NUNES INSTRUMENTATION
Phone: 8940944000 / 8940933000 | Email: info@nunesinstrumentation.com
Web: www.nunesinstrumentation.com`,
    attachmentName: 'Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf',
    attachmentSizeBytes: 5410301,
    attachmentPages: 16,
    driveLink: NUNES_OFFICIAL_CONTACTS.drivePdfLink,
    catalogueUrl: NUNES_OFFICIAL_CONTACTS.catalogueOnlineUrl
  },
  {
    id: 'tpl_institutional_campus_safety',
    name: 'Institutional Safety Awareness & Security Checkpoint Protocol',
    category: 'Campus Awareness',
    badge: 'Security & Campus Welfare',
    title: 'Deployment of Non-Contact Breath Alcohol Screening for Hostel & Campus Security',
    referenceNumber: 'NUNES/CAMPUS/SEC/2026/042',
    targetAudience: 'To The Chief Security Officer / Campus Warden / Administrative Director',
    subject: 'Institutional Campus Security: Enhanced Alcohol Screening Solutions for Entry Checkpoints',
    body: `To
The Chief Security Officer / Campus Warden / Administrative Director

Subject: Institutional Campus Security: Enhanced Alcohol Screening Solutions for Entry Checkpoints

Respected Sir/Madam,

Maintaining secure, disciplined, and safe campus environments requires reliable tools for security staff at main entry gates, hostel entrances, and event access points.

NUNES Instrumentation supplies accredited non-contact screening batons and portable fuel-cell breath testers that enable security personnel to conduct non-invasive, hygienic testing within 3 seconds per person without mouthpieces.

Key features:
• Rapid dual-color red/green visual LED alert with audible threshold buzzer.
• Built-in high-intensity LED torch and acoustic alarm for evening gate duty.
• Long battery endurance supporting up to 3,000 continuous screening cycles.

Review the attached 16-page catalogue for complete technical ratings and specifications.

Warm regards,
NUNES Instrumentation Security Solutions Desk
Coimbatore, Tamil Nadu | Phone: 8940944000`,
    attachmentName: 'Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf',
    attachmentSizeBytes: 5410301,
    attachmentPages: 16,
    driveLink: NUNES_OFFICIAL_CONTACTS.drivePdfLink,
    catalogueUrl: NUNES_OFFICIAL_CONTACTS.catalogueOnlineUrl
  },
  {
    id: 'tpl_product_demo_request',
    name: 'Product Demonstration Request & On-Campus Safety Audit',
    category: 'Demo Request',
    badge: 'Complimentary Demo',
    title: 'Invitation for Free On-Campus Demonstration of Certified Breath Analysers',
    referenceNumber: 'NUNES/DEMO/INST/2026/019',
    targetAudience: 'To The Principal / Administrative Officer / Management Committee',
    subject: 'Complimentary On-Campus Demonstration & Safety Audit - NUNES Instrumentation',
    body: `To
The Principal / Administrative Officer / Management Committee

Subject: Complimentary On-Campus Demonstration & Safety Audit - NUNES Instrumentation

Respected Sir/Madam,

We invite your institution to experience a live, hands-on demonstration of our certified Alcohol Breath Analysers at your campus premises.

Our technical service engineers will demonstrate:
1. Rapid non-contact screening batons for high-volume morning driver queues.
2. Digital handheld breath analysers for administration and hostel checking.
3. Evidential recording units with instant thermal slip printing.

There is zero cost or obligation for this on-site demonstration. Kindly reply or reach out via WhatsApp (+91 89409 44000) with your preferred date and time.

NUNES INSTRUMENTATION
Phone: 8940944000 / 8940933000 | Email: info@nunesinstrumentation.com`,
    attachmentName: 'Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf',
    attachmentSizeBytes: 5410301,
    attachmentPages: 16,
    driveLink: NUNES_OFFICIAL_CONTACTS.drivePdfLink,
    catalogueUrl: NUNES_OFFICIAL_CONTACTS.catalogueOnlineUrl
  },
  {
    id: 'tpl_quotation_followup',
    name: 'Quotation Follow-up & Educational Subsidy Allocation',
    category: 'Quotation Follow-up',
    badge: 'Institutional Subsidy',
    title: 'Special Educational Pricing & Commercial Quotation for Institutional Breath Analysers',
    referenceNumber: 'NUNES/QUOTE/COMM/2026/108',
    targetAudience: 'To The Purchase Officer / Finance Committee / Head of Institution',
    subject: 'Institutional Rate Quotation & Subsidy Allocation: Breath Alcohol Analyser Systems',
    body: `To
The Purchase Officer / Finance Committee / Head of Institution

Subject: Institutional Rate Quotation & Subsidy Allocation: Breath Alcohol Analyser Systems

Respected Sir/Madam,

Further to our institutional safety outreach, NUNES Instrumentation is pleased to extend our 2026 Educational Subsidy Pricing Schedule across all 14 models in our breath analyser lineup.

Institutional Purchase Benefits:
• Special educational subsidy pricing on single units and fleet package purchases.
• Official NABL-traceable calibration certificate provided with every unit.
• 1-Year Comprehensive Warranty and complete spares/sensor replacement support.
• GST-compliant institutional invoicing and dedicated account executive.

Please reply with the number of transport vehicles or campus checkpoints to receive a formal itemised quotation.

NUNES INSTRUMENTATION
Phone: 8940944000 / 8940933000 | Email: info@nunesinstrumentation.com`,
    attachmentName: 'Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf',
    attachmentSizeBytes: 5410301,
    attachmentPages: 16,
    driveLink: NUNES_OFFICIAL_CONTACTS.drivePdfLink,
    catalogueUrl: NUNES_OFFICIAL_CONTACTS.catalogueOnlineUrl
  },
  {
    id: 'tpl_general_company_intro',
    name: 'General Company Introduction & Precision Metrology Solutions',
    category: 'Company Introduction',
    badge: 'Corporate Profile',
    title: 'Introduction to NUNES Instrumentation — Precision Measurement & Safety Technologies',
    referenceNumber: 'NUNES/CORP/PROFILE/2026/001',
    targetAudience: 'To The Correspondent / Principal / Board of Directors',
    subject: 'Introduction to NUNES Instrumentation: Precision Instruments, Science Labs & Safety Solutions',
    body: `To
The Correspondent / Principal / Board of Directors

Subject: Introduction to NUNES Instrumentation: Precision Instruments, Science Labs & Safety Solutions

Respected Sir/Madam,

Headquartered in Coimbatore, Tamil Nadu, NUNES Instrumentation is a trusted manufacturer, distributor, and calibration service provider serving academic institutions, commercial fleets, and research laboratories across South India.

Our Product & Service Portfolio:
1. Fleet & Campus Safety: Certified Alcohol Breath Analysers (14 models).
2. STEM & Science Education: Physics spectrometers, analytical chemical balances, and biology apparatus.
3. Environmental & Meteorological: Temperature/humidity dataloggers, sound level meters, and lux meters.
4. Metrology & Calibration: NABL-traceable calibration and repair services.

We operate three branch locations across Coimbatore with direct customer support desks.

Please review our attached catalogue and visit our web portal at www.nunesinstrumentation.com.

NUNES INSTRUMENTATION
Coimbatore, Tamil Nadu | Phone: 8940944000 / 8940933000 | Email: info@nunesinstrumentation.com`,
    attachmentName: 'Breath_Analyser_Catalogue_14_Individual_Product_QR_Final.pdf',
    attachmentSizeBytes: 5410301,
    attachmentPages: 16,
    driveLink: NUNES_OFFICIAL_CONTACTS.drivePdfLink,
    catalogueUrl: NUNES_OFFICIAL_CONTACTS.catalogueOnlineUrl
  }
];

export const INTERACTIVE_TOUCH_REPLY_BUTTONS = [
  {
    id: 'btn_quote',
    label: 'Request Official Quotation',
    shortLabel: 'Request Quote',
    icon: 'FileText',
    color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    whatsappText: 'Hello NUNES Instrumentation, we would like to request an official quotation for your 14-Model Breath Analyser catalogue for our institution.',
    mailSubject: 'Quotation Request: NUNES Breath Analysers'
  },
  {
    id: 'btn_demo',
    label: 'Book Free On-Campus Demo',
    shortLabel: 'Book Demo',
    icon: 'Calendar',
    color: 'bg-sky-600 hover:bg-sky-700 text-white',
    whatsappText: 'Hello NUNES Instrumentation, we would like to book a complimentary on-campus demonstration of your breath analysers for our drivers and security staff.',
    mailSubject: 'Demo Booking: NUNES Breath Analysers'
  },
  {
    id: 'btn_specs',
    label: 'View Full Online Specs (Netlify)',
    shortLabel: 'Online Specs',
    icon: 'ExternalLink',
    color: 'bg-slate-900 hover:bg-slate-800 text-white',
    url: NUNES_OFFICIAL_CONTACTS.catalogueOnlineUrl
  },
  {
    id: 'btn_pdf',
    label: 'Open 16-Page Catalogue PDF',
    shortLabel: 'View PDF (16p)',
    icon: 'Download',
    color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    url: EXACT_CATALOGUE_PDF.urlPath
  },
  {
    id: 'btn_whatsapp',
    label: 'WhatsApp Technical Desk (+91 89409 44000)',
    shortLabel: 'WhatsApp Us',
    icon: 'MessageCircle',
    color: 'bg-green-600 hover:bg-green-700 text-white',
    url: `https://wa.me/918940944000?text=${encodeURIComponent('Hello NUNES Instrumentation, reaching out regarding the 14-Model Breath Analyser Catalogue.')}`
  },
  {
    id: 'btn_call',
    label: 'Call Nunes Direct: 89409 44000 / 89409 33000',
    shortLabel: 'Call Nunes',
    icon: 'Phone',
    color: 'bg-blue-600 hover:bg-blue-700 text-white',
    url: 'tel:+918940944000'
  },
  {
    id: 'btn_unsubscribe',
    label: 'Unsubscribe from Circulars',
    shortLabel: 'Unsubscribe',
    icon: 'Slash',
    color: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300',
    mailSubject: 'Unsubscribe: NUNES Circulars'
  }
];
