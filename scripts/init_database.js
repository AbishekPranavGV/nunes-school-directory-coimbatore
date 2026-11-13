const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_URL = process.env.DATABASE_URL || 'file:./data/schools.db';
const client = createClient({ url: DB_URL });

const sanitize = (v) => (v === undefined ? null : v);

async function initDb() {
  console.log(`Initializing normalized database at ${DB_URL}...`);

  // 1. Schools table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS schools (
      id TEXT PRIMARY KEY,
      udise_code TEXT UNIQUE NOT NULL,
      school_name TEXT NOT NULL,
      normalized_name TEXT NOT NULL,
      management_type TEXT NOT NULL,
      management TEXT NOT NULL,
      board TEXT NOT NULL,
      school_level TEXT NOT NULL,
      category TEXT NOT NULL,
      classes_offered TEXT,
      address TEXT NOT NULL,
      locality TEXT,
      village_locality TEXT,
      taluk TEXT NOT NULL,
      education_block TEXT NOT NULL,
      block TEXT NOT NULL,
      district TEXT DEFAULT 'Coimbatore',
      state TEXT DEFAULT 'Tamil Nadu',
      urban_rural TEXT NOT NULL,
      pincode TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      google_maps_link TEXT,
      website TEXT,
      contact_page TEXT,
      contact_page_url TEXT,
      established_year INTEGER,
      status TEXT DEFAULT 'ACTIVE',
      source_provenance TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Sources table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      source_type TEXT NOT NULL,
      target_records INTEGER DEFAULT 0,
      imported_records INTEGER DEFAULT 0,
      last_checked TEXT DEFAULT CURRENT_TIMESTAMP,
      last_sync_at TEXT DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'ACTIVE',
      sync_status TEXT DEFAULT 'ACTIVE',
      permissions_policy TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Contacts table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      school_id TEXT NOT NULL,
      contact_type TEXT NOT NULL,
      contact_role TEXT NOT NULL,
      contact_person_name TEXT,
      telephone_number TEXT,
      contact_value TEXT,
      formatted_value TEXT,
      email TEXT,
      whatsapp_url TEXT,
      source_id TEXT,
      is_verified INTEGER DEFAULT 0,
      verification_status TEXT DEFAULT 'UNVERIFIED',
      confidence_score REAL DEFAULT 0.0,
      verified_at TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
    );
  `);

  // 4. Research Jobs table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS research_jobs (
      id TEXT PRIMARY KEY,
      school_id TEXT NOT NULL,
      source_id TEXT,
      job_type TEXT NOT NULL,
      job_status TEXT DEFAULT 'PENDING',
      attempts INTEGER DEFAULT 0,
      error_message TEXT,
      started_at TEXT,
      completed_at TEXT,
      FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
    );
  `);

  // 5. Contact Verifications table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS contact_verifications (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      verification_method TEXT NOT NULL,
      evidence TEXT NOT NULL,
      verified_by TEXT NOT NULL,
      verification_result TEXT NOT NULL,
      verified_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Audit Logs table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT NOT NULL,
      action TEXT NOT NULL,
      record_type TEXT NOT NULL,
      record_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Opt-Outs table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS opt_outs (
      id TEXT PRIMARY KEY,
      identifier_type TEXT NOT NULL,
      identifier_value TEXT NOT NULL,
      school_id TEXT,
      reason TEXT,
      requested_by TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Users table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'viewer',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default sources
  const defaultSources = [
    {
      id: 'src_udise_kys',
      name: 'UDISE+ Know Your School (National Portal)',
      url: 'https://kys.udiseplus.gov.in/',
      type: 'Government Official',
      target: 2097,
      imported: 1981,
      policy: 'Official Ministry of Education UDISE+ database'
    },
    {
      id: 'src_tnea_2026',
      name: 'TNEA 2026 School Block Information Register',
      url: 'https://static.tneaonline.org/docs/9_School_Block_Information_2026.pdf?t=1777680000023',
      type: 'Government Official',
      target: 1240,
      imported: 1240,
      policy: 'Official Tamil Nadu Engineering Admissions block register'
    },
    {
      id: 'src_coimbatore_nic',
      name: 'Coimbatore District Administration & Education',
      url: 'https://coimbatore.nic.in/education/',
      type: 'Government Official',
      target: 2097,
      imported: 2097,
      policy: 'Official NIC Coimbatore portal'
    },
    {
      id: 'src_cbse_saras',
      name: 'CBSE Affiliation Portal (SARAS)',
      url: 'https://saras.cbse.gov.in/',
      type: 'Affiliation Board',
      target: 185,
      imported: 185,
      policy: 'Official Central Board of Secondary Education affiliation directory'
    },
    {
      id: 'src_secondary_dirs',
      name: 'Public Directory Corroboration (SchoolsPedia & GramVikas)',
      url: 'https://www.schoolspedia.in/schools/tamil-nadu/coimbatore',
      type: 'Secondary Public Directory',
      target: 2097,
      imported: 1981,
      policy: 'Corroboration only; strictly verified against school evidence'
    }
  ];

  for (const s of defaultSources) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO sources (id, source_name, source_url, source_type, target_records, imported_records, status, sync_status, permissions_policy)
            VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', 'ACTIVE', ?)`,
      args: [s.id, s.name, s.url, s.type, s.target, s.imported, s.policy]
    });
  }

  // Seed default admin user
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('NunesInstruments2026!', salt);
  await client.execute({
    sql: `INSERT OR REPLACE INTO users (id, username, email, password_hash, role)
          VALUES ('user_admin_01', 'admin', 'admin@nunes.instruments', ?, 'admin')`,
    args: [hash]
  });

  console.log("Database schema, sources, and admin user created.");
}

async function seedData() {
  const masterFile = path.join(__dirname, '..', 'data', 'master_coimbatore_schools.json');
  if (!fs.existsSync(masterFile)) {
    console.error("Master dataset file not found!");
    return;
  }

  const schools = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
  console.log(`Seeding ${schools.length} Coimbatore schools into normalized tables...`);

  const batchSize = 100;
  for (let i = 0; i < schools.length; i += batchSize) {
    const chunk = schools.slice(i, i + batchSize);

    for (const s of chunk) {
      // 1. Insert School
      await client.execute({
        sql: `INSERT OR REPLACE INTO schools (
          id, udise_code, school_name, normalized_name, management_type, management, 
          board, school_level, category, classes_offered, address, locality, village_locality, 
          taluk, education_block, block, district, state, urban_rural, pincode, 
          latitude, longitude, google_maps_link, website, contact_page, contact_page_url, 
          established_year, status, source_provenance, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, 
          ?, ?, ?, ?, ?, ?, ?, 
          ?, ?, ?, ?, ?, ?, ?, 
          ?, ?, ?, ?, ?, ?, 
          ?, ?, ?, CURRENT_TIMESTAMP
        )`,
        args: [
          s.id, s.udise_code, s.school_name, s.normalized_name, s.management, s.management,
          s.board, s.category, s.category, sanitize(s.classes_offered), s.address, sanitize(s.locality || s.block), sanitize(s.village_locality || s.block),
          sanitize(s.taluk || 'Coimbatore South'), sanitize(s.education_block || s.block), s.block, sanitize(s.district || 'Coimbatore'), sanitize(s.state || 'Tamil Nadu'), s.urban_rural, s.pincode,
          sanitize(s.latitude), sanitize(s.longitude), sanitize(s.google_maps_link), sanitize(s.website), sanitize(s.contact_page), sanitize(s.contact_page_url),
          sanitize(s.established_year), sanitize(s.status), s.source_provenance
        ]
      });

      // 2. Insert Contacts with Role and Type
      const contactDefinitions = [
        { type: 'landline', role: 'General Office', val: s.official_landline, phone: s.official_landline },
        { type: 'reception', role: 'Office Reception', val: s.reception_phone, phone: s.reception_phone },
        { type: 'mobile', role: 'School Administration', val: s.official_mobile, phone: s.official_mobile },
        { type: 'whatsapp', role: 'School WhatsApp Business', val: s.official_whatsapp, phone: s.official_whatsapp, wa: s.official_whatsapp ? `https://wa.me/${s.official_whatsapp.replace(/[^0-9]/g, '')}` : null },
        { type: 'email', role: 'General Administration', val: s.official_email, email: s.official_email },
        { type: 'principal_name', role: s.principal_designation || 'Principal', val: s.principal_name, person: s.principal_name },
        { type: 'principal_office_phone', role: 'Principal Desk', val: s.principal_office_phone, phone: s.principal_office_phone },
        { type: 'admissions', role: 'Admissions Desk', val: s.admissions_phone, phone: s.admissions_phone }
      ];

      for (const c of contactDefinitions) {
        if (c.val) {
          const cid = `${s.id}_${c.type}`;
          const isVer = (s.contact_status === 'CONTACT_COMPLETE' || c.type === 'principal_name') ? 1 : 0;
          const status = isVer ? 'VERIFIED' : (s.contact_status === 'PARTIALLY_ENRICHED' ? 'PARTIALLY_ENRICHED' : 'UNVERIFIED');
          const conf = isVer ? 0.95 : (s.contact_status === 'PARTIALLY_ENRICHED' ? 0.50 : 0.10);

          await client.execute({
            sql: `INSERT OR REPLACE INTO contacts (
              id, school_id, contact_type, contact_role, contact_person_name, 
              telephone_number, contact_value, formatted_value, email, whatsapp_url, 
              is_verified, verification_status, confidence_score, verified_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            args: [
              cid, s.id, c.type, c.role, sanitize(c.person),
              sanitize(c.phone), c.val, c.val, sanitize(c.email), sanitize(c.wa),
              isVer, status, conf
            ]
          });
        }
      }

      // 3. Insert Research Job
      await client.execute({
        sql: `INSERT OR REPLACE INTO research_jobs (
          id, school_id, job_type, job_status, attempts, completed_at
        ) VALUES (?, ?, 'AI_WEB_SEARCH', ?, 1, CURRENT_TIMESTAMP)`,
        args: [
          `job_${s.id}`, s.id, s.is_contact_complete ? 'COMPLETED' : 'PENDING'
        ]
      });
    }

    if ((i + batchSize) % 500 === 0 || i + batchSize >= schools.length) {
      console.log(`Seeded ${Math.min(i + batchSize, schools.length)} / ${schools.length} schools...`);
    }
  }

  // Audit log entry
  await client.execute({
    sql: `INSERT INTO audit_logs (id, actor_id, action, record_type, record_id, created_at)
          VALUES ('audit_master_seed_01', 'system_architect', 'MASTER_DATABASE_SEED', 'district_register', 'Coimbatore', CURRENT_TIMESTAMP)`
  });

  console.log("Normalized database successfully seeded!");
}

async function main() {
  try {
    await initDb();
    await seedData();
    process.exit(0);
  } catch (err) {
    console.error("Initialization error:", err);
    process.exit(1);
  }
}

main();
