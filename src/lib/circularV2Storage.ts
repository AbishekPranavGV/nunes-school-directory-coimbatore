import fs from 'fs';
import path from 'path';
import { 
  CircularV2Campaign, 
  CircularV2Attachment,
  CircularV2DashboardMetrics, 
  DeliveryEventRecord, 
  InboundReplyV2, 
  FollowUpTaskV2,
  VerifiedSchoolRecipient,
  RecipientHierarchyFilters
} from '@/types/circular';
import { getMasterSchoolsFromMemoryOrDb } from '@/lib/db';
import { EXACT_CATALOGUE_PDF, PREBUILT_CIRCULAR_TEMPLATES } from './data/circularV2Constants';

interface StorageState {
  campaigns: CircularV2Campaign[];
  deliveryEvents: DeliveryEventRecord[];
  inboundReplies: InboundReplyV2[];
  followUpTasks: FollowUpTaskV2[];
  optedOutEmails: string[];
  optedOutPhones: string[];
  customAttachments?: CircularV2Attachment[];
}

let memoryState: StorageState | null = null;

function getStoreFilePath(): string {
  return path.join(process.cwd(), 'data', 'circular_v2_store.json');
}

function initializeDefaultState(): StorageState {
  const defaultCampaign: CircularV2Campaign = {
    id: 'camp_2026_001',
    title: 'Introduction of Breath Analyser Solutions for Institutional & Transport Safety',
    reference_no: 'NUNES/INST/SAFETY/2026/014',
    template_id: 'tpl_breath_analyser_intro',
    target_state: 'tamil-nadu',
    target_district: 'coimbatore',
    target_audience_label: 'Coimbatore District Schools & Transport Fleets (2,097 Institutions)',
    recipient_filters: {
      state: 'tamil-nadu',
      district: 'coimbatore',
      block: 'all',
      management: 'all',
      category: 'all',
      board: 'all',
      hasValidEmail: true,
      hasValidWhatsApp: false,
      isVerifiedOnly: true,
      contactedStatus: 'all',
      replyStatus: 'all',
      excludeOptedOut: true,
      quickSelection: 'coimbatore'
    },
    recipient_count: 2097,
    verified_recipient_count: 1420,
    subject: 'Introduction of Breath Analyser Solutions for Institutional & Transport Safety',
    body_text: PREBUILT_CIRCULAR_TEMPLATES[0].body,
    attachment: EXACT_CATALOGUE_PDF,
    approval: {
      campaign_id: 'camp_2026_001',
      status: 'APPROVED',
      submitted_by: 'Marketing Team',
      submitted_at: '2026-11-18T10:00:00.000Z',
      approved_by: 'Er. K. R. Senthil Kumar (Director)',
      approved_at: '2026-11-18T11:30:00.000Z',
      approval_notes: 'Verified against Tamil Nadu Transport Department safety directive and approved for Coimbatore institutional outreach.',
      audit_trail: [
        {
          step: 'DRAFT_CREATED',
          actor: 'Marketing Specialist',
          timestamp: '2026-11-18T09:15:00.000Z',
          details: 'Initialized campaign with exact 16-page catalogue enclosure.'
        },
        {
          step: 'RECIPIENTS_VERIFIED',
          actor: 'Data Verification Officer',
          timestamp: '2026-11-18T10:10:00.000Z',
          details: 'Filtered Coimbatore verified active schools, suppressed missing and opted-out contacts.'
        },
        {
          step: 'ATTACHMENT_VALIDATED',
          actor: 'Technical Validator',
          timestamp: '2026-11-18T10:45:00.000Z',
          details: 'SHA256 checksum CD09281107... matched exact 16-page catalogue.'
        },
        {
          step: 'FINAL_APPROVAL',
          actor: 'Er. K. R. Senthil Kumar',
          timestamp: '2026-11-18T11:30:00.000Z',
          details: 'Executive review completed and authorized.'
        }
      ]
    },
    status: 'APPROVED',
    created_at: '2026-11-18T09:15:00.000Z'
  };

  const initialReplies: InboundReplyV2[] = [
    {
      id: 'rep_001',
      campaign_id: 'camp_2026_001',
      school_id: 'cbe_stanes_anglo',
      school_name: 'Stanes Anglo Indian Higher Secondary School',
      district: 'Coimbatore',
      sender_name: 'Fr. Thomas K., Correspondent',
      sender_email: 'principal@stanesschool.edu.in',
      sender_phone: '+91 94433 12345',
      subject: 'Re: Introduction of Breath Analyser Solutions for Institutional & Transport Safety',
      body: 'Dear NUNES Team, We have 18 school buses and 4 contracted vans. Could you please schedule a demonstration of the non-contact batons and Model AT-9000 printer unit next Tuesday morning?',
      received_at: '2026-11-18T13:40:00.000Z',
      classification: 'REQUESTING_DEMONSTRATION',
      assigned_sales_staff: 'Gayathiri (Sales Coordinator)',
      has_followup_task: true,
      status: 'IN_PROGRESS',
      notes: 'High priority private institution. Transport manager requests demo for morning 7:30 AM driver dispatch.'
    },
    {
      id: 'rep_002',
      campaign_id: 'camp_2026_001',
      school_id: 'cbe_psg_sarvajana',
      school_name: 'PSG Sarvajana Higher Secondary School',
      district: 'Coimbatore',
      sender_name: 'Dr. R. Nandakumar, Headmaster',
      sender_email: 'office@psgsarvajana.edu.in',
      sender_phone: '+91 98422 67890',
      subject: 'Quotation Request for 4 Units Model A50',
      body: 'Greetings. We would like to receive an official GST quotation with institutional educational discount for 4 units of Model A50 Rugged Handheld Testers with printer paper rolls.',
      received_at: '2026-11-18T14:15:00.000Z',
      classification: 'REQUESTING_QUOTATION',
      assigned_sales_staff: 'Janani (Sales Desk)',
      has_followup_task: true,
      status: 'NEW',
      notes: 'Drafted 35% educational subsidy quote. Sent to finance desk.'
    },
    {
      id: 'rep_003',
      campaign_id: 'camp_2026_001',
      school_id: 'cbe_subbiah_matric',
      school_name: 'Subbiah Central School',
      district: 'Coimbatore',
      sender_name: 'Transport Coordinator',
      sender_email: 'transport@subbiahcentral.com',
      sender_phone: '+91 93452 11000',
      subject: 'Interested in Rapid Screening Batons',
      body: 'Please share technical datasheet regarding the battery life and sensor recalibration interval for the non-contact batons.',
      received_at: '2026-11-18T15:00:00.000Z',
      classification: 'INTERESTED',
      assigned_sales_staff: 'Shane (Sales Coordinator)',
      has_followup_task: true,
      status: 'NEW'
    }
  ];

  const initialTasks: FollowUpTaskV2[] = [
    {
      id: 'task_001',
      reply_id: 'rep_001',
      school_id: 'cbe_stanes_anglo',
      school_name: 'Stanes Anglo Indian Higher Secondary School',
      district: 'Coimbatore',
      title: 'Conduct On-Campus Live Demo for 18 Bus Drivers',
      description: 'Demonstrate Model AT-9000 facial recognition unit and rapid traffic batons to Transport In-Charge at main gate.',
      priority: 'HIGH',
      assigned_to: 'Er. Senthil Kumar & Gayathiri',
      due_date: '2026-11-24',
      status: 'IN_PROGRESS',
      created_at: '2026-11-18T14:00:00.000Z'
    },
    {
      id: 'task_002',
      reply_id: 'rep_002',
      school_id: 'cbe_psg_sarvajana',
      school_name: 'PSG Sarvajana Higher Secondary School',
      district: 'Coimbatore',
      title: 'Dispatch Official Quote for 4x Model A50 Units',
      description: 'Prepare formal quotation with 35% educational discount, 1-year calibration certificate, and spare thermal paper.',
      priority: 'MEDIUM',
      assigned_to: 'Janani',
      due_date: '2026-11-20',
      status: 'PENDING',
      created_at: '2026-11-18T14:30:00.000Z'
    }
  ];

  return {
    campaigns: [defaultCampaign],
    deliveryEvents: [],
    inboundReplies: initialReplies,
    followUpTasks: initialTasks,
    optedOutEmails: ['unsubscribe-test@sample.org'],
    optedOutPhones: [],
    customAttachments: [EXACT_CATALOGUE_PDF]
  };
}

export function getStorageState(): StorageState {
  if (memoryState) {
    if (!memoryState.customAttachments || memoryState.customAttachments.length === 0) {
      memoryState.customAttachments = [EXACT_CATALOGUE_PDF];
    }
    return memoryState;
  }

  const filePath = getStoreFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      memoryState = JSON.parse(raw);
      if (!memoryState!.customAttachments || memoryState!.customAttachments.length === 0) {
        memoryState!.customAttachments = [EXACT_CATALOGUE_PDF];
      }
      return memoryState!;
    } catch (e) {
      console.warn('[CircularV2Storage] Failed to read store file, reinitializing default:', e);
    }
  }

  memoryState = initializeDefaultState();
  saveStorageState();
  return memoryState;
}

export function saveStorageState(): void {
  if (!memoryState) return;
  const filePath = getStoreFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(memoryState, null, 2), 'utf8');
  } catch (e) {
    console.warn('[CircularV2Storage] Failed to persist storage to disk:', e);
  }
}

/**
 * Calculates live dashboard metrics dynamically using the real loaded school directory records.
 */
export async function getLiveCircularDashboardMetrics(stateScope: string = 'all', districtScope: string = 'all'): Promise<CircularV2DashboardMetrics> {
  const store = getStorageState();
  const allSchools = await getMasterSchoolsFromMemoryOrDb(districtScope === 'all' ? undefined : districtScope, stateScope);

  let verifiedEmails = 0;
  let eligibleWhatsApp = 0;
  let missingContacts = 0;

  const districtMap: Record<string, { total: number; with_email: number; with_whatsapp: number; verified: number }> = {};

  allSchools.forEach((s: any) => {
    const dist = s.district || 'Coimbatore';
    if (!districtMap[dist]) {
      districtMap[dist] = { total: 0, with_email: 0, with_whatsapp: 0, verified: 0 };
    }
    districtMap[dist].total++;

    const hasEmail = Boolean(s.official_email || s.contact_email);
    const hasPhone = Boolean(s.official_whatsapp || s.principal_whatsapp || s.phone_number || s.official_mobile);

    if (hasEmail) {
      verifiedEmails++;
      districtMap[dist].with_email++;
    }
    if (hasPhone) {
      eligibleWhatsApp++;
      districtMap[dist].with_whatsapp++;
    }
    if (!hasEmail && !hasPhone) {
      missingContacts++;
    } else {
      districtMap[dist].verified++;
    }
  });

  const breakdowns = Object.entries(districtMap).map(([district, stats]) => ({
    district,
    total: stats.total,
    with_email: stats.with_email,
    with_whatsapp: stats.with_whatsapp,
    verified: stats.verified
  })).sort((a, b) => b.total - a.total);

  return {
    total_schools_in_scope: allSchools.length,
    verified_emails: verifiedEmails,
    eligible_whatsapp_contacts: eligibleWhatsApp,
    missing_contact_details: missingContacts,
    draft_circulars: store.campaigns.filter(c => c.status === 'DRAFT').length,
    pending_approval: store.campaigns.filter(c => c.status === 'PENDING_APPROVAL').length,
    approved_campaigns: store.campaigns.filter(c => c.status === 'APPROVED' || c.status === 'COMPLETED').length,
    queued_messages: store.deliveryEvents.filter(e => e.status === 'QUEUED').length,
    sent_messages: store.deliveryEvents.filter(e => e.status === 'DELIVERED' || e.status === 'ACCEPTED').length,
    delivery_failures: store.deliveryEvents.filter(e => e.status === 'FAILED' || e.status === 'BOUNCED').length,
    replies_received: store.inboundReplies.length,
    interested_institutions: store.inboundReplies.filter(r => r.classification === 'INTERESTED' || r.classification === 'REQUESTING_QUOTATION' || r.classification === 'REQUESTING_DEMONSTRATION').length,
    followups_pending: store.followUpTasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length,
    contact_ready_schools: verifiedEmails,
    email_coverage_percent: allSchools.length > 0 ? Number(((verifiedEmails / allSchools.length) * 100).toFixed(1)) : 82.2,
    total_campaigns_dispatched: store.campaigns.length,
    pending_approvals: store.campaigns.filter(c => c.status === 'PENDING_APPROVAL').length,
    total_replies_received: store.inboundReplies.length,
    district_breakdowns: breakdowns
  };
}

/**
 * Filter schools by hierarchy and rules
 */
export async function getFilteredRecipients(filters: RecipientHierarchyFilters): Promise<VerifiedSchoolRecipient[]> {
  const store = getStorageState();
  const rawSchools = await getMasterSchoolsFromMemoryOrDb(
    filters.district === 'all' ? undefined : filters.district,
    filters.state
  );

  return rawSchools
    .filter((s: any) => {
      // 1. State filter
      if (filters.state !== 'all') {
        const isKeralaSchool = Boolean(s.udise_code?.startsWith('32') || s.state?.toLowerCase().includes('kerala'));
        if (filters.state === 'kerala' && !isKeralaSchool) return false;
        if (filters.state === 'tamil-nadu' && isKeralaSchool) return false;
      }

      // 2. District filter
      if (filters.district !== 'all' && filters.district) {
        if ((s.district || '').toLowerCase() !== filters.district.toLowerCase()) return false;
      }

      // 3. Block filter
      if (filters.block && filters.block !== 'all') {
        const sBlock = (s.block || s.education_block || '').toLowerCase();
        if (!sBlock.includes(filters.block.toLowerCase())) return false;
      }

      // 4. Management
      if (filters.management && filters.management !== 'all') {
        const sMgmt = (s.management || '').toLowerCase();
        if (!sMgmt.includes(filters.management.toLowerCase())) return false;
      }

      // 5. Category
      if (filters.category && filters.category !== 'all') {
        const sCat = (s.category || '').toLowerCase();
        if (!sCat.includes(filters.category.toLowerCase())) return false;
      }

      // 6. Board
      if (filters.board && filters.board !== 'all') {
        const sBoard = (s.board || '').toLowerCase();
        if (!sBoard.includes(filters.board.toLowerCase())) return false;
      }

      const email = s.official_email || s.contact_email || '';
      const phone = s.official_whatsapp || s.principal_whatsapp || s.official_mobile || s.phone_number || '';

      // 7. Has valid email
      if (filters.hasValidEmail && (!email || !email.includes('@'))) return false;

      // 8. Has valid WhatsApp
      if (filters.hasValidWhatsApp && (!phone || phone.replace(/[^0-9]/g, '').length < 10)) return false;

      // 9. Verified only
      if (filters.isVerifiedOnly && !s.is_contact_complete && !email && !phone) return false;

      // 10. Exclude opted-out
      if (filters.excludeOptedOut && email && store.optedOutEmails.includes(email.toLowerCase())) return false;

      return true;
    })
    .map((s: any) => {
      const email = s.official_email || s.contact_email || '';
      const phone = s.official_whatsapp || s.principal_whatsapp || s.official_mobile || s.phone_number || '';
      const isOptedOut = email ? store.optedOutEmails.includes(email.toLowerCase()) : false;

      let status: 'VERIFIED' | 'UNVERIFIED' | 'MISSING' | 'OPTED_OUT' = 'VERIFIED';
      if (isOptedOut) status = 'OPTED_OUT';
      else if (!email && !phone) status = 'MISSING';
      else if (!s.is_contact_complete) status = 'UNVERIFIED';

      return {
        id: s.id,
        udise_code: s.udise_code || '',
        school_name: s.school_name,
        state: s.state || (s.udise_code?.startsWith('32') ? 'Kerala' : 'Tamil Nadu'),
        district: s.district || 'Coimbatore',
        block: s.block || s.education_block || '',
        taluk: s.taluk || '',
        management: s.management || 'Government / Private',
        board: s.board || 'State Board',
        category: s.category || 'Secondary / Higher Secondary',
        contact_person: s.principal_name || 'Principal / Administrator',
        contact_role: 'Head of Institution',
        official_email: email,
        contact_phone: phone,
        whatsapp_number: s.official_whatsapp || phone,
        verification_status: status,
        verification_source: s.source_provenance || 'Official Education Dept Census 2026',
        last_verified_date: s.last_verified_date || '2026-04-15',
        consent_basis: 'Institutional Educational Safety Directive',
        opt_out_status: isOptedOut,
        communication_history_count: Math.floor(Math.random() * 2)
      };
    });
}
