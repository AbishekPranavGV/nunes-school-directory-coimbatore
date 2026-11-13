export interface DistrictMetadata {
  id: string;
  name: string;
  code: string;
  zone: 'Western' | 'Northern' | 'Central' | 'Southern';
  headquarters: string;
  taluks_count: number;
  blocks_count: number;
  status: 'VERIFIED_ACTIVE' | 'REGISTER_IMPORTED' | 'RECONCILED' | 'QUEUE_CONFIGURED';
  configured: boolean;
  imported: boolean;
  reconciled: boolean;
  total_schools: number;
  verified_schools: number;
  verified_phones: number;
  verified_emails: number;
  verified_whatsapp: number;
  missing_contacts: number;
  description: string;
}

export const TAMIL_NADU_CENSUS_SUMMARY = {
  total_schools: 56789,
  districts_count: 38,
  blocks_count: 385,
  villages_count: 16317,
  breakdown_by_category: {
    primary: 32938,
    upper_primary_middle: 13629,
    secondary_high: 6247,
    higher_secondary: 3975
  },
  breakdown_by_management: {
    government_and_local_body: 44295,
    private_unaided_recognized: 15901,
    government_aided: 8400
  },
  curriculum_boards: {
    state_board: 'State Board (TNDGE)',
    cbse_cisce: 'CBSE / CISCE (ICSE)',
    nios: 'NIOS (Open Schooling)'
  },
  authoritative_registries: [
    'Schools.org.in Tamil Nadu Directory',
    'Tribal & Adi Dravidar Welfare Department',
    'UDISE+ National Portal (11-digit school codes)',
    'TNEA School Block Information Register (874 Pages)',
    'Directorate of School Education (DSE / EMIS)'
  ]
};

export const TAMIL_NADU_DISTRICTS: DistrictMetadata[] = [
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    code: 'CBE',
    zone: 'Western',
    headquarters: 'Coimbatore',
    taluks_count: 11,
    blocks_count: 15,
    status: 'VERIFIED_ACTIVE',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 2097,
    verified_schools: 77,
    verified_phones: 139,
    verified_emails: 77,
    verified_whatsapp: 13,
    missing_contacts: 2020,
    description: 'High-density industrial and educational hub. 15 educational blocks fully audited.'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    code: 'CHN',
    zone: 'Northern',
    headquarters: 'Chennai',
    taluks_count: 16,
    blocks_count: 9,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 3455,
    verified_schools: 150,
    verified_phones: 288,
    verified_emails: 158,
    verified_whatsapp: 26,
    missing_contacts: 3305,
    description: 'State capital metropolitan educational district. Dense corporation and private matriculation schools.'
  },
  {
    id: 'madurai',
    name: 'Madurai',
    code: 'MDU',
    zone: 'Southern',
    headquarters: 'Madurai',
    taluks_count: 11,
    blocks_count: 12,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 2385,
    verified_schools: 92,
    verified_phones: 175,
    verified_emails: 97,
    verified_whatsapp: 19,
    missing_contacts: 2293,
    description: 'Southern cultural and commercial center. Corporation, government and aided institutions.'
  },
  {
    id: 'tiruchirappalli',
    name: 'Tiruchirappalli',
    code: 'TRY',
    zone: 'Central',
    headquarters: 'Tiruchirappalli',
    taluks_count: 11,
    blocks_count: 13,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 2166,
    verified_schools: 83,
    verified_phones: 156,
    verified_emails: 88,
    verified_whatsapp: 15,
    missing_contacts: 2083,
    description: 'Central Tamil Nadu transit & educational center along the Cauvery basin.'
  },
  {
    id: 'salem',
    name: 'Salem',
    code: 'SLM',
    zone: 'Western',
    headquarters: 'Salem',
    taluks_count: 13,
    blocks_count: 18,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 2872,
    verified_schools: 102,
    verified_phones: 204,
    verified_emails: 107,
    verified_whatsapp: 17,
    missing_contacts: 2770,
    description: 'Steel and textile educational district. Extensive government rural & town high schools.'
  },
  {
    id: 'tiruppur',
    name: 'Tiruppur',
    code: 'TPR',
    zone: 'Western',
    headquarters: 'Tiruppur',
    taluks_count: 9,
    blocks_count: 12,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 2045,
    verified_schools: 75,
    verified_phones: 148,
    verified_emails: 80,
    verified_whatsapp: 14,
    missing_contacts: 1970,
    description: 'Textile export center adjoining Coimbatore. Rapidly expanding industrial school network.'
  },
  {
    id: 'erode',
    name: 'Erode',
    code: 'ERD',
    zone: 'Western',
    headquarters: 'Erode',
    taluks_count: 10,
    blocks_count: 13,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1850,
    verified_schools: 68,
    verified_phones: 136,
    verified_emails: 72,
    verified_whatsapp: 12,
    missing_contacts: 1782,
    description: 'Agricultural and commercial textile corridor. Established aided and state schools.'
  },
  {
    id: 'chengalpattu',
    name: 'Chengalpattu',
    code: 'CGL',
    zone: 'Northern',
    headquarters: 'Chengalpattu',
    taluks_count: 8,
    blocks_count: 8,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1509,
    verified_schools: 56,
    verified_phones: 112,
    verified_emails: 60,
    verified_whatsapp: 10,
    missing_contacts: 1453,
    description: 'Southern Chennai suburban and IT educational corridor with modern international schools.'
  },
  {
    id: 'ariyalur',
    name: 'Ariyalur',
    code: 'AYR',
    zone: 'Central',
    headquarters: 'Ariyalur',
    taluks_count: 4,
    blocks_count: 6,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 682,
    verified_schools: 26,
    verified_phones: 52,
    verified_emails: 28,
    verified_whatsapp: 5,
    missing_contacts: 656,
    description: 'Central agricultural district. Rich historic educational blocks along Andimadam.'
  },
  {
    id: 'cuddalore',
    name: 'Cuddalore',
    code: 'CUD',
    zone: 'Northern',
    headquarters: 'Cuddalore',
    taluks_count: 10,
    blocks_count: 12,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 2069,
    verified_schools: 78,
    verified_phones: 154,
    verified_emails: 82,
    verified_whatsapp: 13,
    missing_contacts: 1991,
    description: 'Coastal district with extensive network of state government and aided high schools.'
  },
  {
    id: 'dharmapuri',
    name: 'Dharmapuri',
    code: 'DPI',
    zone: 'Western',
    headquarters: 'Dharmapuri',
    taluks_count: 7,
    blocks_count: 8,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1314,
    verified_schools: 48,
    verified_phones: 94,
    verified_emails: 50,
    verified_whatsapp: 8,
    missing_contacts: 1266,
    description: 'Northern Western Ghats district with extensive government model schools.'
  },
  {
    id: 'dindigul',
    name: 'Dindigul',
    code: 'DGL',
    zone: 'Southern',
    headquarters: 'Dindigul',
    taluks_count: 10,
    blocks_count: 13,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1728,
    verified_schools: 64,
    verified_phones: 128,
    verified_emails: 68,
    verified_whatsapp: 11,
    missing_contacts: 1664,
    description: 'Southern gateway district with prominent missionary and aided educational institutions.'
  },
  {
    id: 'kallakurichi',
    name: 'Kallakurichi',
    code: 'KLK',
    zone: 'Northern',
    headquarters: 'Kallakurichi',
    taluks_count: 7,
    blocks_count: 8,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1168,
    verified_schools: 42,
    verified_phones: 84,
    verified_emails: 44,
    verified_whatsapp: 7,
    missing_contacts: 1126,
    description: 'Agrarian district created from Viluppuram with developing school infrastructure.'
  },
  {
    id: 'kancheepuram',
    name: 'Kancheepuram',
    code: 'KCP',
    zone: 'Northern',
    headquarters: 'Kancheepuram',
    taluks_count: 5,
    blocks_count: 5,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1022,
    verified_schools: 38,
    verified_phones: 76,
    verified_emails: 40,
    verified_whatsapp: 6,
    missing_contacts: 984,
    description: 'Heritage temple district with century-old aided institutions and traditional schools.'
  },
  {
    id: 'kanniyakumari',
    name: 'Kanniyakumari',
    code: 'KKI',
    zone: 'Southern',
    headquarters: 'Nagercoil',
    taluks_count: 6,
    blocks_count: 8,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1436,
    verified_schools: 58,
    verified_phones: 116,
    verified_emails: 62,
    verified_whatsapp: 11,
    missing_contacts: 1378,
    description: 'Highest literacy district in Tamil Nadu. Prominent convent, aided and matriculation schools.'
  },
  {
    id: 'karur',
    name: 'Karur',
    code: 'KRR',
    zone: 'Central',
    headquarters: 'Karur',
    taluks_count: 7,
    blocks_count: 8,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 925,
    verified_schools: 34,
    verified_phones: 68,
    verified_emails: 36,
    verified_whatsapp: 6,
    missing_contacts: 891,
    description: 'Cauvery basin textile hub with compact and well-connected block school networks.'
  },
  {
    id: 'krishnagiri',
    name: 'Krishnagiri',
    code: 'KGI',
    zone: 'Western',
    headquarters: 'Krishnagiri',
    taluks_count: 8,
    blocks_count: 10,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1582,
    verified_schools: 58,
    verified_phones: 114,
    verified_emails: 60,
    verified_whatsapp: 9,
    missing_contacts: 1524,
    description: 'Border industrial and mango horticulture district with expanding CBSE schools.'
  },
  {
    id: 'mayiladuthurai',
    name: 'Mayiladuthurai',
    code: 'MYD',
    zone: 'Central',
    headquarters: 'Mayiladuthurai',
    taluks_count: 4,
    blocks_count: 5,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 755,
    verified_schools: 28,
    verified_phones: 56,
    verified_emails: 30,
    verified_whatsapp: 5,
    missing_contacts: 727,
    description: 'Cauvery delta educational hub with classical foundation schools.'
  },
  {
    id: 'nagapattinam',
    name: 'Nagapattinam',
    code: 'NGP',
    zone: 'Central',
    headquarters: 'Nagapattinam',
    taluks_count: 4,
    blocks_count: 6,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 828,
    verified_schools: 30,
    verified_phones: 60,
    verified_emails: 32,
    verified_whatsapp: 5,
    missing_contacts: 798,
    description: 'Coastal delta district with maritime and government aided schools.'
  },
  {
    id: 'namakkal',
    name: 'Namakkal',
    code: 'NKL',
    zone: 'Western',
    headquarters: 'Namakkal',
    taluks_count: 8,
    blocks_count: 14,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1266,
    verified_schools: 48,
    verified_phones: 96,
    verified_emails: 50,
    verified_whatsapp: 8,
    missing_contacts: 1218,
    description: 'Famous poultry and transport hub renowned for premier state board coaching academies.'
  },
  {
    id: 'perambalur',
    name: 'Perambalur',
    code: 'PBL',
    zone: 'Central',
    headquarters: 'Perambalur',
    taluks_count: 4,
    blocks_count: 4,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 511,
    verified_schools: 18,
    verified_phones: 36,
    verified_emails: 20,
    verified_whatsapp: 3,
    missing_contacts: 493,
    description: 'Central district with focused educational blocks and model government schools.'
  },
  {
    id: 'pudukkottai',
    name: 'Pudukkottai',
    code: 'PDK',
    zone: 'Central',
    headquarters: 'Pudukkottai',
    taluks_count: 12,
    blocks_count: 13,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1533,
    verified_schools: 56,
    verified_phones: 110,
    verified_emails: 58,
    verified_whatsapp: 9,
    missing_contacts: 1477,
    description: 'Princely heritage district with extensive rural primary and middle schools.'
  },
  {
    id: 'ramanathapuram',
    name: 'Ramanathapuram',
    code: 'RMD',
    zone: 'Southern',
    headquarters: 'Ramanathapuram',
    taluks_count: 9,
    blocks_count: 11,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1241,
    verified_schools: 46,
    verified_phones: 90,
    verified_emails: 48,
    verified_whatsapp: 7,
    missing_contacts: 1195,
    description: 'Southern coastal arid zone with dedicated tribal, coastal and aided schools.'
  },
  {
    id: 'ranipet',
    name: 'Ranipet',
    code: 'RPT',
    zone: 'Northern',
    headquarters: 'Ranipet',
    taluks_count: 6,
    blocks_count: 7,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 949,
    verified_schools: 36,
    verified_phones: 70,
    verified_emails: 38,
    verified_whatsapp: 6,
    missing_contacts: 913,
    description: 'Industrial leather corridor with established town matriculation schools.'
  },
  {
    id: 'sivaganga',
    name: 'Sivaganga',
    code: 'SVG',
    zone: 'Southern',
    headquarters: 'Sivaganga',
    taluks_count: 9,
    blocks_count: 12,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1120,
    verified_schools: 42,
    verified_phones: 82,
    verified_emails: 44,
    verified_whatsapp: 7,
    missing_contacts: 1078,
    description: 'Chettinad heritage district with prestigious philanthropic aided foundations.'
  },
  {
    id: 'tenkasi',
    name: 'Tenkasi',
    code: 'TSI',
    zone: 'Southern',
    headquarters: 'Tenkasi',
    taluks_count: 8,
    blocks_count: 10,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1022,
    verified_schools: 38,
    verified_phones: 76,
    verified_emails: 40,
    verified_whatsapp: 6,
    missing_contacts: 984,
    description: 'Foothills district created from Tirunelveli with scenic rural schools.'
  },
  {
    id: 'thanjavur',
    name: 'Thanjavur',
    code: 'TNJ',
    zone: 'Central',
    headquarters: 'Thanjavur',
    taluks_count: 9,
    blocks_count: 14,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1899,
    verified_schools: 72,
    verified_phones: 142,
    verified_emails: 76,
    verified_whatsapp: 12,
    missing_contacts: 1827,
    description: 'Cultural capital of the Cauvery delta with century-old educational establishments.'
  },
  {
    id: 'theni',
    name: 'Theni',
    code: 'THN',
    zone: 'Southern',
    headquarters: 'Theni',
    taluks_count: 5,
    blocks_count: 8,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 876,
    verified_schools: 32,
    verified_phones: 64,
    verified_emails: 34,
    verified_whatsapp: 5,
    missing_contacts: 844,
    description: 'Western Ghats border district with horticulture valley school systems.'
  },
  {
    id: 'the-nilgiris',
    name: 'The Nilgiris',
    code: 'NIL',
    zone: 'Western',
    headquarters: 'Udhagamandalam',
    taluks_count: 6,
    blocks_count: 4,
    status: 'VERIFIED_ACTIVE',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 370,
    verified_schools: 370,
    verified_phones: 370,
    verified_emails: 370,
    verified_whatsapp: 370,
    missing_contacts: 0,
    description: 'Premier residential, boarding, and tea estate plantation community schools across Ooty, Coonoor, Kotagiri, and Gudalur.'
  },
  {
    id: 'thoothukudi',
    name: 'Thoothukudi',
    code: 'TKI',
    zone: 'Southern',
    headquarters: 'Thoothukudi',
    taluks_count: 10,
    blocks_count: 12,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1485,
    verified_schools: 56,
    verified_phones: 112,
    verified_emails: 60,
    verified_whatsapp: 9,
    missing_contacts: 1429,
    description: 'Port city and pearl fishery district with high-density aided mission schools.'
  },
  {
    id: 'tirunelveli',
    name: 'Tirunelveli',
    code: 'TNV',
    zone: 'Southern',
    headquarters: 'Tirunelveli',
    taluks_count: 8,
    blocks_count: 9,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1387,
    verified_schools: 52,
    verified_phones: 104,
    verified_emails: 54,
    verified_whatsapp: 8,
    missing_contacts: 1335,
    description: 'Major educational center of South Tamil Nadu on the banks of Thamirabarani.'
  },
  {
    id: 'tirupathur',
    name: 'Tirupathur',
    code: 'TPT',
    zone: 'Northern',
    headquarters: 'Tirupathur',
    taluks_count: 4,
    blocks_count: 6,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 925,
    verified_schools: 34,
    verified_phones: 68,
    verified_emails: 36,
    verified_whatsapp: 5,
    missing_contacts: 891,
    description: 'Javadi hills and valley district with active government tribal residential schools.'
  },
  {
    id: 'tiruvallur',
    name: 'Tiruvallur',
    code: 'TLR',
    zone: 'Northern',
    headquarters: 'Tiruvallur',
    taluks_count: 9,
    blocks_count: 14,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 2093,
    verified_schools: 78,
    verified_phones: 154,
    verified_emails: 82,
    verified_whatsapp: 13,
    missing_contacts: 2015,
    description: 'Northern industrial corridor adjoining Chennai with mixed urban and rural schools.'
  },
  {
    id: 'tiruvannamalai',
    name: 'Tiruvannamalai',
    code: 'TVM',
    zone: 'Northern',
    headquarters: 'Tiruvannamalai',
    taluks_count: 12,
    blocks_count: 17,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 2240,
    verified_schools: 82,
    verified_phones: 164,
    verified_emails: 86,
    verified_whatsapp: 13,
    missing_contacts: 2158,
    description: 'Extensive educational blocks covering eastern ghats, tribal, and rural areas.'
  },
  {
    id: 'tiruvarur',
    name: 'Tiruvarur',
    code: 'TVR',
    zone: 'Central',
    headquarters: 'Tiruvarur',
    taluks_count: 8,
    blocks_count: 10,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1071,
    verified_schools: 40,
    verified_phones: 78,
    verified_emails: 42,
    verified_whatsapp: 6,
    missing_contacts: 1031,
    description: 'Agricultural delta district with traditional high schools and model institutions.'
  },
  {
    id: 'vellore',
    name: 'Vellore',
    code: 'VEL',
    zone: 'Northern',
    headquarters: 'Vellore',
    taluks_count: 6,
    blocks_count: 7,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1193,
    verified_schools: 46,
    verified_phones: 90,
    verified_emails: 48,
    verified_whatsapp: 8,
    missing_contacts: 1147,
    description: 'Historic fort city and educational hub with renowned collegiate high schools.'
  },
  {
    id: 'viluppuram',
    name: 'Viluppuram',
    code: 'VLP',
    zone: 'Northern',
    headquarters: 'Viluppuram',
    taluks_count: 9,
    blocks_count: 13,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1826,
    verified_schools: 68,
    verified_phones: 134,
    verified_emails: 72,
    verified_whatsapp: 11,
    missing_contacts: 1758,
    description: 'Agricultural district with central railway junction and widespread village schools.'
  },
  {
    id: 'virudhunagar',
    name: 'Virudhunagar',
    code: 'VDN',
    zone: 'Southern',
    headquarters: 'Virudhunagar',
    taluks_count: 10,
    blocks_count: 11,
    status: 'REGISTER_IMPORTED',
    configured: true,
    imported: true,
    reconciled: true,
    total_schools: 1558,
    verified_schools: 58,
    verified_phones: 116,
    verified_emails: 62,
    verified_whatsapp: 10,
    missing_contacts: 1500,
    description: 'Commercial and printing powerhouse with high-performance state board institutions.'
  }
];

export const DISTRICT_ALIASES: Record<string, string> = {
  // The Nilgiris & aliases (including user's phonetic spelling 'nilagiris' / 'nilagiri')
  'nilgiris': 'The Nilgiris',
  'nilagiris': 'The Nilgiris',
  'nilagiri': 'The Nilgiris',
  'the-nilgiris': 'The Nilgiris',
  'thenilgiris': 'The Nilgiris',
  'the nilgiris': 'The Nilgiris',
  'ooty': 'The Nilgiris',
  'udhagamandalam': 'The Nilgiris',
  'coonoor': 'The Nilgiris',
  'kotagiri': 'The Nilgiris',
  'gudalur': 'The Nilgiris',
  'pandalur': 'The Nilgiris',
  'kundah': 'The Nilgiris',

  // Thoothukudi & aliases
  'thoothukudi': 'Thoothukudi',
  'thoothukkudi': 'Thoothukudi',
  'tuticorin': 'Thoothukudi',
  'tuticorine': 'Thoothukudi',

  // Kanniyakumari & aliases
  'kanniyakumari': 'Kanniyakumari',
  'kanyakumari': 'Kanniyakumari',
  'nagercoil': 'Kanniyakumari',

  // Tiruchirappalli & aliases
  'tiruchirappalli': 'Tiruchirappalli',
  'tiruchirapalli': 'Tiruchirappalli',
  'trichy': 'Tiruchirappalli',
  'tiruchi': 'Tiruchirappalli',

  // Kancheepuram & aliases
  'kancheepuram': 'Kancheepuram',
  'kanchipuram': 'Kancheepuram',
  'kanchi': 'Kancheepuram',

  // Viluppuram & aliases
  'viluppuram': 'Viluppuram',
  'villupuram': 'Viluppuram',
  'vizhuppuram': 'Viluppuram',

  // Tiruvarur & aliases
  'tiruvarur': 'Tiruvarur',
  'thiruvarur': 'Tiruvarur',

  // Tirunelveli & aliases
  'tirunelveli': 'Tirunelveli',
  'nellai': 'Tirunelveli',

  // Chengalpattu & aliases
  'chengalpattu': 'Chengalpattu',
  'chengalpet': 'Chengalpattu',

  // Tiruvannamalai & aliases
  'tiruvannamalai': 'Tiruvannamalai',
  'thiruvannamalai': 'Tiruvannamalai',

  // Tirupathur & aliases
  'tirupathur': 'Tirupathur',
  'thirupathur': 'Tirupathur',
  'tirupattur': 'Tirupathur',

  // Tiruvallur & aliases
  'tiruvallur': 'Tiruvallur',
  'thiruvallur': 'Tiruvallur',

  // Mayiladuthurai & aliases
  'mayiladuthurai': 'Mayiladuthurai',
  'mayiladuturai': 'Mayiladuthurai',
  'mayuram': 'Mayiladuthurai',

  // Coimbatore & aliases
  'coimbatore': 'Coimbatore',
  'kovai': 'Coimbatore',
  'cbe': 'Coimbatore',

  // Chennai & aliases
  'chennai': 'Chennai',
  'madras': 'Chennai',
  'chn': 'Chennai',

  // Madurai
  'madurai': 'Madurai',
  'mdu': 'Madurai',

  // Salem
  'salem': 'Salem',
  'slm': 'Salem',

  // Erode
  'erode': 'Erode',
  'erd': 'Erode'
};

export function normalizeDistrictSlug(str: string): string {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getCanonicalDistrictName(query: string): string | undefined {
  if (!query) return undefined;
  const raw = query.toLowerCase().trim();
  const slug = normalizeDistrictSlug(query);
  
  if (DISTRICT_ALIASES[raw]) return DISTRICT_ALIASES[raw];
  if (DISTRICT_ALIASES[slug]) return DISTRICT_ALIASES[slug];
  
  const found = TAMIL_NADU_DISTRICTS.find(d => 
    normalizeDistrictSlug(d.name) === slug || 
    normalizeDistrictSlug(d.id) === slug ||
    d.code.toLowerCase() === raw
  );
  return found?.name;
}

export function matchesDistrict(recordDistrict: string, queryDistrict: string): boolean {
  if (!queryDistrict || queryDistrict === 'all' || queryDistrict === 'statewide') return true;
  if (!recordDistrict) return false;
  
  const recSlug = normalizeDistrictSlug(recordDistrict);
  const qSlug = normalizeDistrictSlug(queryDistrict);
  
  // Direct normalized match (e.g. 'thenilgiris' === 'thenilgiris')
  if (recSlug === qSlug) return true;
  
  // Canonical match via alias dictionary
  const canonicalRec = getCanonicalDistrictName(recordDistrict) || recordDistrict;
  const canonicalQ = getCanonicalDistrictName(queryDistrict) || queryDistrict;
  
  if (normalizeDistrictSlug(canonicalRec) === normalizeDistrictSlug(canonicalQ)) {
    return true;
  }
  
  return false;
}

export function getDistrictById(districtId: string): DistrictMetadata | undefined {
  if (!districtId) return undefined;
  const slug = normalizeDistrictSlug(districtId);
  const canonicalName = getCanonicalDistrictName(districtId);
  
  return TAMIL_NADU_DISTRICTS.find(d => 
    normalizeDistrictSlug(d.id) === slug || 
    normalizeDistrictSlug(d.name) === slug ||
    (canonicalName && normalizeDistrictSlug(d.name) === normalizeDistrictSlug(canonicalName))
  );
}

export function getStatewideTotals() {
  return {
    total_districts: 38,
    total_schools: TAMIL_NADU_CENSUS_SUMMARY.total_schools,
    total_blocks: TAMIL_NADU_CENSUS_SUMMARY.blocks_count,
    total_villages: TAMIL_NADU_CENSUS_SUMMARY.villages_count,
    verified_schools: TAMIL_NADU_DISTRICTS.reduce((a, b) => a + b.verified_schools, 0),
    verified_phones: TAMIL_NADU_DISTRICTS.reduce((a, b) => a + b.verified_phones, 0),
    verified_emails: TAMIL_NADU_DISTRICTS.reduce((a, b) => a + b.verified_emails, 0),
    verified_whatsapp: TAMIL_NADU_DISTRICTS.reduce((a, b) => a + b.verified_whatsapp, 0),
    missing_contacts: TAMIL_NADU_DISTRICTS.reduce((a, b) => a + b.missing_contacts, 0)
  };
}
