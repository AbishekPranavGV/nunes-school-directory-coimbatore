import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';

let clientInstance: Client | null = null;

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const bundledDbPath = path.join(process.cwd(), 'data', 'schools.db');

  // Check if we are running in a serverless environment (Vercel, AWS Lambda, or Linux in production)
  const isServerless = Boolean(
    process.env.VERCEL || 
    process.env.AWS_LAMBDA_FUNCTION_NAME || 
    (process.platform === 'linux' && process.env.NODE_ENV === 'production')
  );

  if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'schools.db');
    try {
      const needCopy = !fs.existsSync(tmpDbPath) || (fs.existsSync(bundledDbPath) && fs.statSync(tmpDbPath).size === 0);
      if (needCopy && fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
        if (fs.existsSync(`${bundledDbPath}-wal`)) {
          try { fs.copyFileSync(`${bundledDbPath}-wal`, `${tmpDbPath}-wal`); } catch (_) {}
        }
        if (fs.existsSync(`${bundledDbPath}-shm`)) {
          try { fs.copyFileSync(`${bundledDbPath}-shm`, `${tmpDbPath}-shm`); } catch (_) {}
        }
      }
      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (err) {
      console.warn('[DB] Failed copying to /tmp, falling back to bundled db:', err);
    }
  }

  return `file:${bundledDbPath}`;
}

export function getDb(): Client {
  if (clientInstance) {
    return clientInstance;
  }

  const dbUrl = resolveDatabaseUrl();

  clientInstance = createClient({
    url: dbUrl,
  });

  return clientInstance;
}

let memoryCacheCoimbatore: any[] | null = null;
let memoryCacheStatewide: any[] | null = null;

export async function safeDbExecute(client: Client, stmt: any): Promise<any> {
  try {
    return await client.execute(stmt);
  } catch (err: any) {
    const isReadOnly = 
      err?.message?.includes('SQLITE_READONLY') || 
      err?.message?.includes('readonly database') ||
      err?.code === 'SQLITE_READONLY' || 
      err?.rawCode === 8;
    if (isReadOnly) {
      console.warn('[DB safeDbExecute] Suppressed SQLITE_READONLY in serverless environment:', err.message);
      return { rows: [], columns: [], rowsAffected: 0, lastInsertRowid: undefined };
    }
    throw err;
  }
}

import { matchesDistrict } from './data/tamilNaduDistricts';

// Helper to query master schools with in-memory caching and statewide multi-district filtering
export async function getMasterSchoolsFromMemoryOrDb(district?: string): Promise<any[]> {
  const normDistrict = (district || '').toLowerCase().trim();

  // Load statewide dataset if needed
  if (normDistrict === 'all' || normDistrict === 'statewide' || (normDistrict && !matchesDistrict('Coimbatore', normDistrict))) {
    if (!memoryCacheStatewide) {
      const statewidePath = path.join(process.cwd(), 'data', 'master_statewide_schools.json');
      if (fs.existsSync(statewidePath)) {
        try {
          const raw = fs.readFileSync(statewidePath, 'utf8');
          memoryCacheStatewide = JSON.parse(raw);
        } catch (e) {
          console.warn('[DB] Error loading master_statewide_schools.json:', e);
        }
      }
    }

    if (memoryCacheStatewide && memoryCacheStatewide.length > 0) {
      if (normDistrict === 'all' || normDistrict === 'statewide') {
        return memoryCacheStatewide;
      }
      return memoryCacheStatewide.filter((s: any) => 
        matchesDistrict(s.district || '', normDistrict)
      );
    }
  }

  // Default / Coimbatore: Return cached 2,097 schools
  if (memoryCacheCoimbatore) {
    return memoryCacheCoimbatore;
  }

  const jsonPath = path.join(process.cwd(), 'data', 'master_coimbatore_schools.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      memoryCacheCoimbatore = JSON.parse(raw);
      return memoryCacheCoimbatore!;
    } catch (e) {
      console.warn('[DB] Error loading master_coimbatore_schools.json:', e);
    }
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

  memoryCacheCoimbatore = rs.rows.map((row: any) => ({
    ...row,
    is_contact_complete: Boolean(row.official_landline || row.official_mobile || row.official_whatsapp || row.official_email)
  }));

  return memoryCacheCoimbatore;
}
