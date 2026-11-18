export const OFFICIAL_CIRCULAR_DRIVE_LINK = 'https://drive.google.com/file/d/1PgEWdCogcIsrZ3Xv9q6NdDtRhgL8bSeF/view?usp=sharing';

export interface NunesInternalBccMember {
  name: string;
  role: string;
  email: string;
}

export const NUNES_INTERNAL_BCC_MEMBERS: NunesInternalBccMember[] = [
  { name: 'Gayathiri', role: 'Sales Coordinator', email: 'global@nunesinstruments.com' },
  { name: 'Janani', role: 'Marketing Person', email: 'nunesexpo@gmail.com' },
  { name: 'Kaviya', role: 'Marketing User', email: 'overseas@nunesinstruments.com' },
  { name: 'Mercy', role: 'Sales User', email: 'export@nunesinstruments.com' },
  { name: 'Radha', role: 'Sales Coordinator', email: 'chennai@nunesinstruments.com' },
  { name: 'Sabitha', role: 'Marketing User', email: 'instruchennai@gmail.com' },
  { name: 'Shane', role: 'Sales Coordinator', email: 'admin@nunesinstruments.com' },
  { name: 'Sukanya', role: 'Sales Coordinator', email: 'kochi@nunesinstruments.com' },
  { name: 'Yazhini', role: 'Sales User', email: 'expo@nunesinstruments.com' }
];

export const NUNES_INTERNAL_BCC_EMAILS: string[] = NUNES_INTERNAL_BCC_MEMBERS.map(m => m.email);

export const GMAIL_SENDER = {
  email: 'nunesalcotest@gmail.com',
  name: 'Nunes Instruments Alcotest Division',
  formatted: '"Nunes Instruments Alcotest Division" <nunesalcotest@gmail.com>',
  cc: 'nunescbe@gmail.com',
  cc_formatted: '"Nunes Instruments Head Office" <nunescbe@gmail.com>',
  bcc_description: 'customers email id + 9 Nunes internal sales/marketing coordinators',
  bcc_team_emails: NUNES_INTERNAL_BCC_EMAILS,
  circular_drive_link: OFFICIAL_CIRCULAR_DRIVE_LINK
};
