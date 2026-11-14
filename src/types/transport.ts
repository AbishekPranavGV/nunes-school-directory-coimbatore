export type ServiceCategory = 'bus' | 'lorry' | 'logistics' | 'govt' | 'all';

export type TransportCategoryType =
  | 'Omni Bus (Intercity Sleeper / AC)'
  | 'Tourist Coach & Contract Carriage'
  | 'Staff & Educational Bus'
  | 'State Transport Corporation (Govt)'
  | 'Heavy Commercial Lorry (Multi-Axle)'
  | 'Bulk LPG & Petroleum Tanker'
  | 'Container & Port Logistics'
  | 'ODC & Heavy Trailer Haulage'
  | 'Parcel, Express Cargo & FTL'
  | '3PL & Multimodal Logistics'
  | 'Mini Truck & Light Commercial'
  | 'Transport Regulatory & Apex Association'
  | 'Port Drayage & Container Freight';

export interface BranchOffice {
  id: string;
  branch_name: string;
  city: string;
  district: string;
  manager_name: string;
  manager_designation?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  pincode: string;
  facility_type:
    | 'Booking & Passenger Terminal'
    | 'Transshipment & Cargo Yard'
    | 'Container Drayage Depot'
    | 'Heavy Vehicle Workshop'
    | 'Express Parcel Depot'
    | 'Government STU Depot & Divisional Office'
    | 'Multimodal Logistics Park (MMLP)'
    | 'Port Drayage & Terminal';
  is_headquarters?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface TransportRecord {
  id: string;
  company_name: string;
  category: TransportCategoryType;
  service_type: 'bus' | 'lorry' | 'logistics' | 'govt';
  owner_name: string;
  owner_designation: string;
  contact_number: string;
  whatsapp_number: string;
  email: string;
  secondary_contact?: string;
  city_hub: string;
  district: string;
  state: string;
  address: string;
  pincode: string;
  routes: string[];
  fleet_size: string;
  vehicle_types: string[];
  permit_type:
    | 'National Permit (All India)'
    | 'South Zone Permit'
    | 'State Goods Carriage'
    | 'All India Tourist Permit (AITP)'
    | 'Stage Carriage'
    | 'Government STU Stage Carriage'
    | 'Multimodal Logistics Operator (MTO)'
    | 'Apex Transport Regulatory';
  gstin?: string;
  udyam_reg?: string;
  established_year: number;
  verification_status: 'Verified' | 'Active' | 'Contacted' | 'Pending Review';
  source: string;
  specialties: string[];
  rating: number;
  latitude?: number;
  longitude?: number;
  branches: BranchOffice[];
  created_at: string;
  updated_at: string;
}

export interface TransportKPI {
  total_fleets: number;
  bus_services: number;
  lorry_services: number;
  logistics_services: number;
  govt_services: number;
  verified_owners: number;
  whatsapp_verified: number;
  email_verified: number;
  districts_covered: number;
  national_permits: number;
  total_branches_count: number;
  kerala_fleets?: number;
  tamil_nadu_fleets?: number;
}

export interface TransportCircular {
  id: string;
  title: string;
  ref_no: string;
  category:
    | 'Fleet Safety & RTO Mandate'
    | 'Industrial Freight Tender'
    | 'Diesel Subsidy & Toll Compliance'
    | 'Vehicle Modernization & Inspection'
    | 'Interstate Permit Notification';
  target_audience:
    | 'All Transport Fleets'
    | 'Omni Bus Operators Only'
    | 'Heavy Multi-Axle Lorries Only'
    | 'LPG Tankers & Petroleum Fleets'
    | 'Customs Container Freight';
  target_districts: string[];
  target_state?: 'all' | 'Tamil Nadu' | 'Kerala';
  subject: string;
  body: string;
  signatory_name: string;
  signatory_title: string;
  issuing_authority: string;
  attachment_name?: string;
  created_at: string;
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Archived';
  recipient_count?: number;
}

export interface SenderQuotaMetrics {
  daily_limit: number;
  sent_today: number;
  remaining_today: number;
  hourly_rate: number;
  hourly_limit: number;
  cooldown_resets_in: string;
  smtp_status: 'Healthy' | 'Throttled' | 'Warmup Active';
  smtp_provider: string;
}

export interface EmailDeliverabilityStats {
  total_dispatched: number;
  delivered_count: number;
  delivery_rate_pct: number;
  opened_count: number;
  open_rate_pct: number;
  clicked_count: number;
  click_rate_pct: number;
  bounced_count: number;
  bounce_rate_pct: number;
  hard_bounces: number;
  soft_bounces: number;
  complaint_count: number;
  complaint_rate_pct: number;
  deliverability_rating: 'Optimal' | 'Warning' | 'Critical';
}

export interface BouncedEmailRecord {
  id: string;
  company_name: string;
  operator_id: string;
  recipient_name: string;
  recipient_email: string;
  whatsapp_number: string;
  district: string;
  circular_ref: string;
  bounce_type: 'Hard Bounce (Permanent)' | 'Soft Bounce (Temporary)' | 'Spam Complaint' | 'DNS Failure';
  error_code: string;
  error_reason: string;
  timestamp: string;
  retry_attempts: number;
  status: 'Unresolved' | 'Retried' | 'Alternative Found' | 'Switched to WhatsApp';
}

export type TransportWorkspaceView =
  | 'dashboard'
  | 'circulars'
  | 'branches'
  | 'map'
  | 'dispatch'
  | 'missing'
  | 'reports';
