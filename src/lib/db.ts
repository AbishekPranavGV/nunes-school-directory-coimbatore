import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';

let clientInstance: Client | null = null;

export function getDb(): Client {
  if (clientInstance) {
    return clientInstance;
  }

  const dbUrl = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'data', 'schools.db')}`;

  clientInstance = createClient({
    url: dbUrl,
  });

  return clientInstance;
}

// Helper to query all master schools with high performance
export async function getMasterSchoolsFromMemoryOrDb() {
  const jsonPath = path.join(process.cwd(), 'data', 'master_coimbatore_schools.json');
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(raw);
  }
  
  // Fallback to SQLite DB query with join on normalized contacts
  const db = getDb();
  const rs = await db.execute(`
    SELECT s.*, 
           MAX(CASE WHEN c.contact_type = 'landline' THEN c.formatted_value END) as official_landline,
           MAX(CASE WHEN c.contact_type = 'reception' THEN c.formatted_value END) as reception_phone,
           MAX(CASE WHEN c.contact_type = 'mobile' THEN c.formatted_value END) as official_mobile,
           MAX(CASE WHEN c.contact_type = 'mobile' THEN c.formatted_value END) as admin_mobile,
           MAX(CASE WHEN c.contact_type = 'whatsapp' THEN c.formatted_value END) as official_whatsapp,
           MAX(CASE WHEN c.contact_type = 'email' THEN c.formatted_value END) as official_email,
           MAX(CASE WHEN c.contact_type = 'principal_name' THEN c.contact_person_name END) as principal_name,
           MAX(CASE WHEN c.contact_type = 'principal_office_phone' THEN c.formatted_value END) as principal_office_phone,
           MAX(CASE WHEN c.contact_type = 'admissions' THEN c.formatted_value END) as admissions_phone
    FROM schools s
    LEFT JOIN contacts c ON s.id = c.school_id
    GROUP BY s.id
  `);

  return rs.rows.map((row: any) => ({
    ...row,
    is_contact_complete: Boolean(row.official_landline || row.official_mobile || row.official_whatsapp || row.official_email)
  }));
}
