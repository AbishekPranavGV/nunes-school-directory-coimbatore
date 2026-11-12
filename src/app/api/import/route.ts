import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Reviewer role required for import' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const mode = (formData.get('mode') as string) || 'execute'; // 'preview' or 'execute'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const { headers, rows } = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'File contains no data rows' }, { status: 400 });
    }

    // Identify column indices
    const headerLower = headers.map(h => h.toLowerCase());
    const findIdx = (keywords: string[]) => 
      headerLower.findIndex(h => keywords.some(k => h.includes(k)));

    const udiseIdx = findIdx(['udise', 'code', 's no']);
    const nameIdx = findIdx(['school name', 'name', 'school']);
    const mgtIdx = findIdx(['management', 'type']);
    const boardIdx = findIdx(['board']);
    const catIdx = findIdx(['category', 'level']);
    const blockIdx = findIdx(['block']);
    const pinIdx = findIdx(['pin', 'pincode']);
    const phoneIdx = findIdx(['phone', 'landline']);
    const mobIdx = findIdx(['mobile']);
    const waIdx = findIdx(['whatsapp']);
    const emailIdx = findIdx(['email']);
    const princIdx = findIdx(['principal', 'headmaster']);
    const princOffIdx = findIdx(['principal office', 'office phone']);

    // Deduplicate against UDISE in the batch
    const seenUdise = new Set<string>();
    const validRows: any[] = [];
    let duplicateCount = 0;
    let missingValuesCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      let udise = udiseIdx >= 0 && r[udiseIdx] ? r[udiseIdx].trim() : `331299${Date.now() + i}`;
      let name = nameIdx >= 0 && r[nameIdx] ? r[nameIdx].trim() : `School ${i + 1}`;
      let block = blockIdx >= 0 && r[blockIdx] ? r[blockIdx].trim() : 'Coimbatore City';
      let pin = pinIdx >= 0 && r[pinIdx] ? r[pinIdx].trim() : '641001';

      if (seenUdise.has(udise)) {
        duplicateCount++;
        continue; // Deduplicate: do not process duplicate UDISE in batch
      }
      seenUdise.add(udise);

      const phone = phoneIdx >= 0 && r[phoneIdx] ? r[phoneIdx].trim() : null;
      const mob = mobIdx >= 0 && r[mobIdx] ? r[mobIdx].trim() : null;
      const wa = waIdx >= 0 && r[waIdx] ? r[waIdx].trim() : null;
      const email = emailIdx >= 0 && r[emailIdx] ? r[emailIdx].trim() : null;
      const princ = princIdx >= 0 && r[princIdx] ? r[princIdx].trim() : null;
      const princOff = princOffIdx >= 0 && r[princOffIdx] ? r[princOffIdx].trim() : null;

      if (!phone && !mob && !wa && !email) {
        missingValuesCount++;
      }

      validRows.push({
        udise_code: udise,
        school_name: name,
        management: mgtIdx >= 0 && r[mgtIdx] ? r[mgtIdx].trim() : 'Private Unaided',
        board: boardIdx >= 0 && r[boardIdx] ? r[boardIdx].trim() : 'Tamil Nadu State Board',
        category: catIdx >= 0 && r[catIdx] ? r[catIdx].trim() : 'Primary',
        block: block,
        pincode: pin,
        official_landline: phone,
        official_mobile: mob,
        official_whatsapp: wa,
        official_email: email,
        principal_name: princ,
        principal_office_phone: princOff,
        is_contact_complete: Boolean(phone || mob || wa || email)
      });
    }

    if (mode === 'preview') {
      return NextResponse.json({
        mode: 'preview',
        filename: file.name,
        total_rows: rows.length,
        valid_rows: validRows.length,
        duplicate_count: duplicateCount,
        missing_contacts_count: missingValuesCount,
        preview_sample: validRows.slice(0, 5)
      });
    }

    // Execute Import into SQLite DB
    const db = getDb();
    let imported = 0;
    for (const v of validRows) {
      const id = `sch_imp_${v.udise_code}`;
      const norm = v.school_name.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();

      await db.execute({
        sql: `INSERT OR REPLACE INTO schools (
          id, udise_code, school_name, normalized_name, management, board, category, 
          block, urban_rural, address, pincode, source_provenance, status, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Urban', ?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP)`,
        args: [
          id, v.udise_code, v.school_name, norm, v.management, v.board, v.category,
          v.block, `${v.school_name}, ${v.block}, Coimbatore - ${v.pincode}`, v.pincode,
          `Batch Import: ${file.name}`
        ]
      });

      if (v.official_landline) {
        await db.execute({
          sql: `INSERT OR REPLACE INTO contacts (id, school_id, contact_type, contact_value, formatted_value, is_verified, verification_source, verification_status, confidence_score)
                VALUES (?, ?, 'landline', ?, ?, 1, 'Batch Import', 'OFFICIAL_CONFIRMED', 0.9)`,
          args: [`${id}_landline`, id, v.official_landline, v.official_landline]
        });
      }

      imported++;
    }

    // Record Import Job
    await db.execute({
      sql: `INSERT INTO import_jobs (id, job_type, filename, status, total_records, imported_count, duplicate_count, error_count, log_details, completed_at)
            VALUES (?, 'CSV_UPLOAD', ?, 'COMPLETED', ?, ?, ?, 0, ?, CURRENT_TIMESTAMP)`,
      args: [
        `job_${Date.now()}`, 
        file.name, 
        rows.length, 
        imported, 
        duplicateCount, 
        `Imported ${imported} schools. Reconciled ${duplicateCount} duplicates.`
      ]
    });

    return NextResponse.json({
      success: true,
      filename: file.name,
      total_rows: rows.length,
      imported_count: imported,
      duplicate_count: duplicateCount,
      missing_contacts_count: missingValuesCount,
      message: `Successfully processed ${rows.length} rows (${imported} imported, ${duplicateCount} duplicates reconciled).`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
