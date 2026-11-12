export type ManagementType = 
  | 'Government / Education Department'
  | 'Corporation / Local Body'
  | 'Government Aided'
  | 'Private Unaided'
  | 'Kendriya Vidyalaya'
  | 'Social/Tribal Welfare';

export type BoardType = 
  | 'Tamil Nadu State Board'
  | 'Matriculation'
  | 'Anglo-Indian'
  | 'CBSE'
  | 'ICSE'
  | 'IB / International'
  | 'Unknown';

export type CategoryType = 
  | 'Nursery / Montessori / Kindergarten'
  | 'Primary'
  | 'Middle'
  | 'Secondary'
  | 'Higher Secondary'
  | 'Residential'
  | 'Special';

export type WorkflowState = 
  | 'NOT_SEARCHED'
  | 'IN_RESEARCH'
  | 'FOUND_UNVERIFIED'
  | 'VERIFIED_INSTITUTION_CONTACT'
  | 'PRINCIPAL_OFFICE_VERIFIED'
  | 'NO_PUBLIC_CONTACT_FOUND'
  | 'RECHECK_REQUIRED';

export type VerificationConfidence = 
  | 'OFFICIAL_CONFIRMED'
  | 'DIRECTORY_UNVERIFIED'
  | 'MISSING'
  | 'STALE'
  | 'REJECTED';

export interface WaterfallStep {
  step: string;
  label: string;
  checked_url: string;
  http_status: number;
  result: string;
  timestamp: string;
}

export interface SchoolRecord {
  id: string;
  udise_code: string;
  school_name: string;
  normalized_name: string;
  management: string;
  board: string;
  category: string;
  block: string;
  urban_rural: 'Urban' | 'Rural';
  village_locality?: string;
  address: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  website?: string | null;
  contact_page?: string | null;
  established_year?: number;
  status: 'ACTIVE' | 'HISTORICAL' | 'CLOSED';
  source_provenance: string;

  // Contacts
  official_landline?: string | null;
  official_mobile?: string | null;
  official_whatsapp?: string | null;
  official_email?: string | null;
  principal_name?: string | null;
  principal_office_phone?: string | null;

  // Verification & State
  is_contact_complete: boolean;
  workflow_state: WorkflowState;
  verification_confidence: VerificationConfidence;
  missing_reasons?: string | null;
  next_action?: string;
  assigned_staff?: string;
  last_checked?: string;

  // Detailed relations
  waterfall?: WaterfallStep[];
}

export interface KPIMetrics {
  target_source_records: number; // 2,097
  total_imported_schools: number;
  verified_any_contact: number;
  verified_phone: number;
  verified_whatsapp: number;
  verified_email: number;
  verified_principal_name: number;
  verified_principal_office: number;
  high_priority_missing_contacts: number;
  duplicates_reconciled: number;
  pending_staff_review: number;
  coverage_percentage: number;
  last_refresh_timestamp: string;
}

export interface SourceRegistryItem {
  id: string;
  source_name: string;
  source_url: string;
  source_type: string;
  target_records: number;
  imported_records: number;
  last_sync_at: string;
  sync_status: string;
  error_log?: string;
  permissions_policy?: string;
}

export interface UserSession {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'reviewer' | 'viewer';
}
