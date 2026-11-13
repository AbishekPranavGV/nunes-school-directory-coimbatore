export interface ProviderReport {
  id: string;
  provider_name: string;
  provider_type: string;
  is_available: boolean;
  config_status: 'READY' | 'CONFIGURED' | 'MISSING_API_KEY' | 'RATE_LIMITED' | 'NETWORK_ERROR';
  search_attempts: number;
  schools_matched: number;
  contacts_discovered: number;
  contacts_verified: number;
  error_count: number;
  errors?: string[];
  last_successful_execution: string;
  actual_usage_cost: string;
  notes: string;
}

export interface ContactCandidate {
  id: string;
  school_id: string;
  provider_id: string;
  contact_type: 'landline' | 'mobile' | 'whatsapp' | 'email' | 'principal_office_phone';
  contact_role: string;
  contact_value: string;
  formatted_value: string;
  source_url: string;
  retrieval_date: string;
  ownership_evidence: string;
  verification_method: string;
  confidence_level: number;
  exact_school_matching: boolean;
  is_shared_group_number: boolean;
  campus_group_name?: string;
  mx_verified?: boolean;
  approval_status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'CONFLICT';
  manual_approval_required: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at?: string;
}

export interface StaffCallingLogItem {
  id: string;
  school_id: string;
  school_name?: string;
  block?: string;
  staff_name: string;
  called_phone: string;
  call_outcome: 
    | 'VERIFIED_OFFICIAL_OFFICE'
    | 'BUSY'
    | 'NO_ANSWER'
    | 'WRONG_NUMBER'
    | 'DISCONNECTED'
    | 'FLAGGED_INCORRECT'
    | 'REQUEST_ANOTHER_SOURCE';
  headmaster_confirmed?: string;
  principal_desk_phone?: string;
  whatsapp_confirmed?: string;
  email_confirmed?: string;
  notes?: string;
  opt_out_requested: boolean;
  created_at: string;
}

export interface PriorityQueueItem {
  school_id: string;
  udise_code: string;
  school_name: string;
  taluk: string;
  block: string;
  board: string;
  category: string;
  research_state: 'UNRESEARCHED' | 'PARTIAL' | 'CONFLICT' | 'OUTDATED' | 'COMPLETE';
  priority_tier: 1 | 2 | 3; // 1: Unresearched, 2: Partial/Conflicting, 3: Completed/Monitoring
  attempt_count: number;
  last_attempt?: string;
  next_action: string;
  missing_fields: string[];
}
