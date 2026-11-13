import { getDb } from '@/lib/db';
import { ProviderReport, ContactCandidate, StaffCallingLogItem, PriorityQueueItem } from './types';
import dns from 'dns';

export const PROVIDER_IDS = {
  SEARCH_ENGINE: 'src_search_engine',
  GOOGLE_PLACES: 'src_google_places',
  EDU_DEPT_BEO: 'src_edu_dept_beo',
  PDF_DOCS: 'src_pdf_docs',
  AFFILIATION_BOARDS: 'src_affiliation_boards',
  WEBSITE_CRAWLER: 'src_website_crawler',
  SOCIAL_PROFILES: 'src_social_profiles',
  STAFF_SWITCHBOARD: 'src_staff_switchboard',
  EMAIL_VERIFICATION: 'src_email_verification',
  WHATSAPP_BUSINESS: 'src_whatsapp_business',
  GROUP_CAMPUS: 'src_group_campus',
  WORKER_RETRY: 'src_worker_retry'
} as const;

// Known Coimbatore School Groups for Campus & Central Office Matching
export const COIMBATORE_SCHOOL_GROUPS = [
  {
    group_name: 'Sri Ramakrishna Educational Institutions (SNR Sons Trust)',
    patterns: ['ramakrishna', 'snr sons'],
    central_office_phone: '+91 422 2562710',
    central_office_address: 'Avarampalayam Road, Siddhapudur, Coimbatore - 641044',
    website: 'https://www.snrsonstrust.org'
  },
  {
    group_name: "PSG & Sons' Charities Educational Network",
    patterns: ['psg sarvajana', 'psg public', 'psg primary', 'psg'],
    central_office_phone: '+91 422 2572265',
    central_office_address: 'Avinashi Road, Peelamedu, Coimbatore - 641004',
    website: 'https://www.psgtech.edu'
  },
  {
    group_name: 'Chinmaya Mission Educational Institutions',
    patterns: ['chinmaya vidyalaya', 'chinmaya'],
    central_office_phone: '+91 422 2542173',
    central_office_address: 'R.S. Puram, Coimbatore - 641002',
    website: 'https://www.chinmayavidyalayacbe.org'
  },
  {
    group_name: 'Kendriya Vidyalaya Sangathan (Chennai Region - Coimbatore)',
    patterns: ['kendriya vidyalaya', 'kvs'],
    central_office_phone: '+91 422 2314545',
    central_office_address: 'Sowripalayam Road / Air Force Station Sulur, Coimbatore',
    website: 'https://kvsangathan.nic.in'
  },
  {
    group_name: 'Bharatiya Vidya Bhavan Coimbatore Kendra',
    patterns: ['bharatiya vidya bhavan', 'bhavan'],
    central_office_phone: '+91 422 2471676',
    central_office_address: 'D.B. Road, R.S. Puram, Coimbatore - 641002',
    website: 'https://www.bhavans.info'
  },
  {
    group_name: 'Stanes Educational Institutions',
    patterns: ['stanes', 'sir robert stanes'],
    central_office_phone: '+91 422 2213455',
    central_office_address: 'Avinashi Road, Coimbatore - 641018',
    website: 'https://www.stanesschool.org'
  }
];

// Helper: Check if school belongs to a known Coimbatore management group
export function matchSchoolGroup(schoolName: string): {
  matched: boolean;
  group_name?: string;
  central_phone?: string;
  is_shared_group_number: boolean;
} {
  const lowerName = (schoolName || '').toLowerCase();
  for (const g of COIMBATORE_SCHOOL_GROUPS) {
    if (g.patterns.some(p => lowerName.includes(p))) {
      return {
        matched: true,
        group_name: g.group_name,
        central_phone: g.central_office_phone,
        is_shared_group_number: true
      };
    }
  }
  return {
    matched: false,
    is_shared_group_number: false
  };
}

// Helper: Check DNS MX Records for Email Verification
export async function verifyEmailMx(email: string): Promise<{ validSyntax: boolean; hasMx: boolean; domain: string; mxRecords?: string[] }> {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validSyntax = emailRegex.test(email);
  if (!validSyntax) {
    return { validSyntax: false, hasMx: false, domain: '' };
  }

  const domain = email.split('@')[1].toLowerCase();
  try {
    const mxRecords = await dns.promises.resolveMx(domain);
    return {
      validSyntax: true,
      hasMx: mxRecords && mxRecords.length > 0,
      domain,
      mxRecords: mxRecords.map(r => r.exchange)
    };
  } catch (err) {
    return {
      validSyntax: true,
      hasMx: false,
      domain
    };
  }
}

// Helper: Retrieve all 12 provider reports from database
export async function getProviderReports(): Promise<ProviderReport[]> {
  const db = getDb();
  try {
    const res = await db.execute('SELECT * FROM provider_registry ORDER BY id ASC');
    if (res.rows && res.rows.length > 0) {
      return res.rows.map((r: any) => ({
        id: r.id,
        provider_name: r.provider_name,
        provider_type: r.provider_type,
        is_available: Boolean(r.is_available),
        config_status: r.config_status as any,
        search_attempts: Number(r.search_attempts || 0),
        schools_matched: Number(r.schools_matched || 0),
        contacts_discovered: Number(r.contacts_discovered || 0),
        contacts_verified: Number(r.contacts_verified || 0),
        error_count: Number(r.error_count || 0),
        last_successful_execution: r.last_execution || new Date().toISOString(),
        actual_usage_cost: `${r.usage_cost_currency === 'USD' ? '$' : '₹'}${Number(r.actual_usage_cost || 0).toFixed(2)}`,
        notes: r.notes || ''
      }));
    }
  } catch (err) {
    console.error('Error fetching provider registry:', err);
  }

  return [];
}

// Helper: Increment provider statistics in database
export async function incrementProviderStats(
  providerId: string, 
  delta: { attempts?: number; matched?: number; discovered?: number; verified?: number; errors?: number; lastError?: string; costInr?: number }
) {
  const db = getDb();
  try {
    await db.execute({
      sql: `UPDATE provider_registry 
            SET search_attempts = search_attempts + ?,
                schools_matched = schools_matched + ?,
                contacts_discovered = contacts_discovered + ?,
                contacts_verified = contacts_verified + ?,
                error_count = error_count + ?,
                last_error = COALESCE(?, last_error),
                actual_usage_cost = actual_usage_cost + ?,
                last_execution = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [
        delta.attempts || 0,
        delta.matched || 0,
        delta.discovered || 0,
        delta.verified || 0,
        delta.errors || 0,
        delta.lastError || null,
        delta.costInr || 0,
        providerId
      ]
    });
  } catch (err) {
    console.error(`Failed to update provider stats for ${providerId}:`, err);
  }
}

// Priority Queue Builder: Sorts schools by priority tier (Section B)
// Tier 1: Never researched
// Tier 2: Partial contacts or conflicting
// Tier 3: Completed / monitoring
export function buildPriorityQueue(schools: any[]): PriorityQueueItem[] {
  return schools.map(s => {
    let tier: 1 | 2 | 3 = 1;
    let researchState: PriorityQueueItem['research_state'] = 'UNRESEARCHED';
    let nextAction = 'Run Multi-Engine Search & DEO Register Corroboration';

    const missingFields: string[] = [];
    if (!s.official_landline && !s.official_mobile) missingFields.push('Telephone');
    if (!s.principal_name) missingFields.push('Principal');
    if (!s.official_whatsapp) missingFields.push('WhatsApp');
    if (!s.official_email) missingFields.push('Email');

    if (s.is_contact_complete) {
      tier = 3;
      researchState = 'COMPLETE';
      nextAction = 'Scheduled monthly verification check';
    } else if (s.contact_status === 'PARTIALLY_ENRICHED' || missingFields.length <= 2) {
      tier = 2;
      researchState = 'PARTIAL';
      nextAction = 'Dispatch Staff Telephone Verification call';
    } else {
      tier = 1;
      researchState = 'UNRESEARCHED';
      nextAction = 'Execute BEO District Register & SARAS Directory Lookup';
    }

    return {
      school_id: s.id,
      udise_code: s.udise_code,
      school_name: s.school_name,
      taluk: s.taluk || '',
      block: s.block || '',
      board: s.board || '',
      category: s.category || '',
      research_state: researchState,
      priority_tier: tier,
      attempt_count: s.research_jobs?.length || 0,
      last_attempt: s.last_checked || s.last_verified_date,
      next_action: nextAction,
      missing_fields: missingFields
    };
  }).sort((a, b) => a.priority_tier - b.priority_tier);
}
