export type CircularSectionTab =
  | 'dashboard'
  | 'create'
  | 'templates'
  | 'recipients'
  | 'attachments'
  | 'preview'
  | 'approval'
  | 'campaigns'
  | 'tracking'
  | 'replies'
  | 'reports';

export type UserRole = 'ADMIN' | 'MARKETING' | 'SALES' | 'VIEWER';

export interface CircularV2Template {
  id: string;
  name: string;
  category: 'Breath Analyser Introduction' | 'Transport Safety' | 'Campus Awareness' | 'Demo Request' | 'Quotation Follow-up' | 'Company Introduction';
  badge: string;
  title: string;
  referenceNumber: string;
  targetAudience: string;
  subject: string;
  body: string;
  attachmentName: string;
  attachmentSizeBytes: number;
  attachmentPages: number;
  driveLink?: string;
  catalogueUrl?: string;
  isDefault?: boolean;
}

export interface CircularV2Attachment {
  id: string;
  filename: string;
  originalName: string;
  urlPath: string;
  localPath: string;
  sizeBytes: number;
  sizeFormatted: string;
  pageCount: number;
  sha256Checksum: string;
  version: string;
  description: string;
  isVerified: boolean;
  uploadedAt: string;
}

export interface RecipientHierarchyFilters {
  state: 'all' | 'tamil-nadu' | 'kerala';
  district: string; // 'all' or district id
  block: string;
  management: string; // Government, Aided, Private, etc.
  category: string; // Primary, Middle, Secondary, Higher Secondary
  board: string; // State Board, CBSE, ICSE, Matric
  hasValidEmail: boolean;
  hasValidWhatsApp: boolean;
  isVerifiedOnly: boolean;
  contactedStatus: 'all' | 'contacted' | 'not_contacted';
  replyStatus: 'all' | 'replied' | 'not_replied';
  excludeOptedOut: boolean;
  quickSelection: 'coimbatore' | 'tn_38' | 'selected_districts' | 'selected_schools' | 'saved_list';
  selectedDistrictIds?: string[];
  selectedSchoolIds?: string[];
}

export interface VerifiedSchoolRecipient {
  id: string;
  udise_code: string;
  school_name: string;
  state: string;
  district: string;
  block: string;
  taluk: string;
  management: string;
  board: string;
  category: string;
  contact_person: string;
  contact_role: string;
  official_email: string;
  contact_phone: string;
  whatsapp_number: string;
  verification_status: 'VERIFIED' | 'UNVERIFIED' | 'MISSING' | 'OPTED_OUT';
  verification_source: string;
  last_verified_date: string;
  consent_basis: string;
  opt_out_status: boolean;
  last_campaign_sent?: string;
  communication_history_count: number;
}

export type CampaignApprovalStatus =
  | 'DRAFT'
  | 'RECIPIENTS_VERIFIED'
  | 'ATTACHMENT_VALIDATED'
  | 'TEST_SENT'
  | 'APPROVED'
  | 'REJECTED';

export interface CampaignApprovalRecord {
  campaign_id: string;
  status: CampaignApprovalStatus;
  submitted_by?: string;
  submitted_at?: string;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  audit_trail: Array<{
    step: string;
    actor: string;
    timestamp: string;
    details: string;
  }>;
}

export interface CircularV2Campaign {
  id: string;
  title: string;
  reference_no: string;
  template_id?: string;
  target_state: string;
  target_district: string;
  target_audience_label: string;
  recipient_filters: RecipientHierarchyFilters;
  recipient_count: number;
  verified_recipient_count: number;
  subject: string;
  body_text: string;
  body?: string;
  attachment: CircularV2Attachment;
  approval: CampaignApprovalRecord;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  created_at?: string;
  dispatched_at?: string;
  completed_at?: string;
  total_dispatched?: number;
  successful_deliveries?: number;
  failed_deliveries?: number;
  opened_count?: number;
  replies_count?: number;
}

export type DeliveryStatus = 'QUEUED' | 'ACCEPTED' | 'DELIVERED' | 'FAILED' | 'BOUNCED';

export interface DeliveryEventRecord {
  id: string;
  campaign_id: string;
  school_id: string;
  school_name: string;
  district: string;
  recipient_email: string;
  recipient_whatsapp?: string;
  channel: 'EMAIL' | 'WHATSAPP';
  status: DeliveryStatus;
  timestamp: string;
  latency_ms: number;
  provider_code?: string;
  error_reason?: string;
}

export type ReplyClassification =
  | 'INTERESTED'
  | 'REQUESTING_QUOTATION'
  | 'REQUESTING_DEMONSTRATION'
  | 'NEEDS_MORE_INFORMATION'
  | 'NOT_INTERESTED'
  | 'UNSUBSCRIBE'
  | 'UNKNOWN_MANUAL_REVIEW';

export interface InboundReplyV2 {
  id: string;
  campaign_id: string;
  school_id: string;
  school_name: string;
  district: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  subject: string;
  body: string;
  received_at: string;
  classification: ReplyClassification;
  assigned_sales_staff?: string;
  has_followup_task: boolean;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  notes?: string;
}

export interface FollowUpTaskV2 {
  id: string;
  reply_id?: string;
  school_id: string;
  school_name: string;
  district: string;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assigned_to: string;
  due_date: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  created_at: string;
}

export interface CircularV2DashboardMetrics {
  total_schools_in_scope: number;
  verified_emails: number;
  eligible_whatsapp_contacts: number;
  missing_contact_details: number;
  draft_circulars: number;
  pending_approval: number;
  approved_campaigns: number;
  queued_messages: number;
  sent_messages: number;
  delivery_failures: number;
  replies_received: number;
  interested_institutions: number;
  followups_pending: number;
  contact_ready_schools?: number;
  email_coverage_percent?: number;
  total_campaigns_dispatched?: number;
  pending_approvals?: number;
  total_replies_received?: number;
  district_breakdowns: Array<{
    district: string;
    total: number;
    with_email: number;
    with_whatsapp: number;
    verified: number;
  }>;
}
