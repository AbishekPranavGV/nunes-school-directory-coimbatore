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

export type ContactStatus = 
  | 'CONTACT_COMPLETE'
  | 'PARTIALLY_ENRICHED'
  | 'CONTACT_MISSING'
  | 'NEEDS_MANUAL_VERIFICATION'
  | 'STALE_CONTACT';

export type MissingQueueCategory = 
  | 'AWAITING_FIRST_RESEARCH'
  | 'REQUIRING_ANOTHER_SOURCE'
  | 'NEEDS_MANUAL_VERIFICATION'
  | 'STALE_CONTACT'
  | 'NO_DISCOVERABLE_CONTACT'
  | 'COMPLETE';

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

export interface ResearchJob {
  id: string;
  school_id: string;
  source_id?: string;
  job_type: 'AI_WEB_SEARCH' | 'GOV_REGISTER_LOOKUP' | 'OFFICIAL_SITE_CRAWL' | 'CONTACT_PAGE_PARSE' | 'MANUAL_VERIFICATION_DISPATCH';
  job_status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  attempts: number;
  error_message?: string | null;
  started_at?: string;
  completed_at?: string;
}

export interface ContactVerification {
  id: string;
  contact_id: string;
  verification_method: 'HTTP_CRAWL' | 'BOARD_AFFILIATION_LOOKUP' | 'STAFF_SWITCHBOARD_CALL' | 'DOMAIN_WHOIS' | 'MANUAL_DOCUMENT_AUDIT';
  evidence: string;
  verified_by: string;
  verification_result: string;
  verified_at: string;
}

export interface SchoolRecord {
  id: string;
  udise_code: string;
  school_name: string;
  normalized_name: string;
  management: string;
  board: string;
  category: string;
  classes_offered: string;
  address: string;
  locality: string;
  village_locality?: string;
  taluk: string;
  education_block: string;
  block: string;
  district: string;
  state: string;
  urban_rural: 'Urban' | 'Rural';
  pincode: string;
  latitude?: number;
  longitude?: number;
  google_maps_link: string;
  website?: string | null;
  contact_page?: string | null;
  contact_page_url?: string | null;
  established_year?: number;
  status: 'ACTIVE' | 'HISTORICAL' | 'CLOSED';
  source_provenance: string;

  // Principal / Headmaster Contact Information
  principal_name?: string | null;
  principal_designation?: string | null;
  principal_office_phone?: string | null;
  principal_mobile?: string | null;
  principal_email?: string | null;
  principal_whatsapp?: string | null;

  // School Office Contact Information
  official_landline?: string | null;
  reception_phone?: string | null;
  official_mobile?: string | null;
  admin_mobile?: string | null;
  admissions_phone?: string | null;
  official_whatsapp?: string | null;
  alternate_phone?: string | null;
  official_email?: string | null;
  additional_emails?: string | null;

  // Contact status & work queue
  is_contact_complete: boolean;
  contact_status: ContactStatus;
  missing_queue_category: MissingQueueCategory;
  workflow_state: WorkflowState;
  verification_confidence: VerificationConfidence;
  confidence_score: number;
  missing_reasons?: string | null;
  next_action?: string;
  assigned_staff?: string;
  last_checked?: string;
  last_verified_date?: string;

  // Relations & logs
  waterfall?: WaterfallStep[];
  research_jobs?: ResearchJob[];
  verifications?: ContactVerification[];
}

export interface KPIMetrics {
  target_source_records: number; // 2,097
  total_imported_schools: number;
  verified_schools: number;
  verified_any_contact: number;
  verified_phone: number;
  verified_principal_office: number;
  verified_whatsapp: number;
  verified_email: number;
  verified_principal_name: number;
  high_priority_missing_contacts: number;
  duplicates_reconciled: number;
  records_awaiting_verification: number;
  pending_staff_review: number;
  recently_updated_contacts: number;
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
  last_checked?: string;
  last_sync_at: string;
  status?: string;
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

export type WorkspaceView = 
  | 'dashboard'
  | 'directory'
  | 'discovery'
  | 'verification'
  | 'circulars'
  | 'communications'
  | 'staff'
  | 'reports'
  | 'settings';

export interface CircularItem {
  id: string;
  title: string;
  reference_number: string;
  circular_date: string;
  subject: string;
  body_text: string;
  extracted_text?: string;
  attachment_name?: string;
  attachment_type?: string;
  attachment_size_kb?: number;
  generated_email_subject: string;
  generated_email_body: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ARCHIVED';
  created_at: string;
  approved_by?: string;
  approved_at?: string;
  target_group: string;
  eligible_count: number;
  email_ready_count: number;
}

export interface OutboundCommunication {
  id: string;
  circular_id: string;
  circular_title: string;
  school_id: string;
  school_name: string;
  recipient_email: string;
  sender_email: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SCHEDULED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'REPLIED' | 'NEEDS_FOLLOW_UP';
  subject: string;
  message_id?: string;
  thread_id?: string;
  sent_at?: string;
  delivered_at?: string;
  failure_reason?: string;
  reply_count: number;
  last_reply_at?: string;
  response_classification?: string;
}

export interface InboundReply {
  id: string;
  communication_id: string;
  school_id: string;
  school_name: string;
  sender_email: string;
  sender_name?: string;
  subject: string;
  body_text: string;
  received_at: string;
  classification: 'Acknowledged' | 'Interested' | 'Information Requested' | 'Document Requested' | 'Not Interested' | 'Wrong Contact' | 'Needs Follow-Up' | 'Unclassified';
  assigned_staff?: string;
  status: 'UNREAD' | 'REVIEWED' | 'REPLIED' | 'RESOLVED';
  internal_notes?: string;
}
