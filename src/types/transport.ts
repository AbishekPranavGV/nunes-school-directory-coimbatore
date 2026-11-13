export type ServiceCategory = 'bus' | 'lorry' | 'logistics' | 'all';

export type TransportCategoryType =
  | 'Omni Bus (Intercity Sleeper / AC)'
  | 'Tourist Coach & Contract Carriage'
  | 'Staff & Educational Bus'
  | 'Heavy Commercial Lorry (Multi-Axle)'
  | 'Bulk LPG & Petroleum Tanker'
  | 'Container & Port Logistics'
  | 'ODC & Heavy Trailer Haulage'
  | 'Parcel, Express Cargo & FTL'
  | 'Mini Truck & Light Commercial';

export interface TransportRecord {
  id: string;
  company_name: string;
  category: TransportCategoryType;
  service_type: 'bus' | 'lorry' | 'logistics';
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
  permit_type: 'National Permit (All India)' | 'South Zone Permit' | 'State Goods Carriage' | 'All India Tourist Permit (AITP)' | 'Stage Carriage';
  gstin?: string;
  udyam_reg?: string;
  established_year: number;
  verification_status: 'Verified' | 'Active' | 'Contacted' | 'Pending Review';
  source: string;
  specialties: string[];
  rating: number;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface TransportKPI {
  total_fleets: number;
  bus_services: number;
  lorry_services: number;
  verified_owners: number;
  whatsapp_verified: number;
  email_verified: number;
  districts_covered: number;
  national_permits: number;
}

export type TransportWorkspaceView =
  | 'dashboard'
  | 'map'
  | 'dispatch'
  | 'missing'
  | 'reports'
  | 'sources';
