import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';

let clientInstance: Client | null = null;

export function getDb(): Client {
  if (clientInstance) {
    return clientInstance;
  }

  // Support DATABASE_URL if set (Postgres / Turso / LibSQL remote)
  // Else fallback to local data/schools.db or in-memory
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
  
  // Fallback to SQLite DB
  const db = getDb();
  const rs = await db.execute(`
    SELECT s.*, 
           w.workflow_state, w.is_contact_complete, w.missing_reasons, w.next_action, w.assigned_staff,
           MAX(CASE WHEN c.contact_type = 'landline' THEN c.formatted_value END) as official_landline,
           MAX(CASE WHEN c.contact_type = 'mobile' THEN c.formatted_value END) as official_mobile,
           MAX(CASE WHEN c.contact_type = 'whatsapp' THEN c.formatted_value END) as official_whatsapp,
           MAX(CASE WHEN c.contact_type = 'email' THEN c.formatted_value END) as official_email,
           MAX(CASE WHEN c.contact_type = 'principal_name' THEN c.formatted_value END) as principal_name,
           MAX(CASE WHEN c.contact_type = 'principal_office_phone' THEN c.formatted_value END) as principal_office_phone
    FROM schools s
    LEFT JOIN contact_work_queue w ON s.id = w.school_id
    LEFT JOIN contacts c ON s.id = c.school_id
    GROUP BY s.id
  `);

  return rs.rows.map((row: any) => ({
    ...row,
    is_contact_complete: Boolean(row.is_contact_complete)
  }));
}
