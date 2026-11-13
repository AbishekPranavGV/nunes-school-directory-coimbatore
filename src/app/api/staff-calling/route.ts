import { NextRequest, NextResponse } from 'next/server';
import { getMasterSchoolsFromMemoryOrDb, getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { incrementProviderStats, PROVIDER_IDS } from '@/lib/discovery/providers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const block = searchParams.get('block') || '';
    const outcome = searchParams.get('outcome') || '';
    const search = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);

    const allSchools = await getMasterSchoolsFromMemoryOrDb();
    const db = getDb();

    // Fetch recent calling logs
    const callLogsRes = await db.execute(`
      SELECT l.*, s.school_name, s.block, s.taluk 
      FROM staff_calling_logs l
      LEFT JOIN schools s ON l.school_id = s.id
      ORDER BY l.created_at DESC
      LIMIT 100
    `);

    // Calculate staff calling stats
    const statsRes = await db.execute(`
      SELECT 
        COUNT(*) as total_calls,
        SUM(CASE WHEN call_outcome = 'VERIFIED_OFFICIAL_OFFICE' THEN 1 ELSE 0 END) as verified_calls,
        SUM(CASE WHEN call_outcome = 'BUSY' THEN 1 ELSE 0 END) as busy_calls,
        SUM(CASE WHEN call_outcome = 'NO_ANSWER' THEN 1 ELSE 0 END) as no_answer_calls,
        SUM(CASE WHEN call_outcome = 'WRONG_NUMBER' THEN 1 ELSE 0 END) as wrong_number_calls,
        SUM(CASE WHEN call_outcome = 'FLAGGED_INCORRECT' THEN 1 ELSE 0 END) as flagged_incorrect
      FROM staff_calling_logs
    `);

    // Filter schools for verification queue
    let filtered = allSchools;
    if (block) {
      filtered = filtered.filter((s: any) => s.block?.toLowerCase() === block.toLowerCase() || s.education_block?.toLowerCase() === block.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((s: any) => 
        s.school_name?.toLowerCase().includes(q) ||
        s.udise_code?.toLowerCase().includes(q) ||
        s.block?.toLowerCase().includes(q)
      );
    }

    const totalCount = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedSchools = filtered.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      stats: statsRes.rows[0] || {
        total_calls: 0,
        verified_calls: 0,
        busy_calls: 0,
        no_answer_calls: 0,
        wrong_number_calls: 0,
        flagged_incorrect: 0
      },
      schools: paginatedSchools.map((s: any) => ({
        id: s.id,
        udise_code: s.udise_code,
        school_name: s.school_name,
        management: s.management,
        board: s.board,
        block: s.block,
        taluk: s.taluk,
        official_landline: s.official_landline || null,
        official_mobile: s.official_mobile || null,
        official_whatsapp: s.official_whatsapp || null,
        official_email: s.official_email || null,
        principal_name: s.principal_name || null,
        principal_office_phone: s.principal_office_phone || null,
        is_contact_complete: s.is_contact_complete,
        contact_status: s.contact_status,
        missing_queue_category: s.missing_queue_category
      })),
      recent_calls: callLogsRes.rows,
      pagination: {
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const staffName = user?.username || 'Staff Operator';

    const body = await req.json();
    const {
      school_id,
      called_phone,
      call_outcome,
      headmaster_confirmed,
      principal_desk_phone,
      whatsapp_confirmed,
      email_confirmed,
      notes,
      opt_out_requested
    } = body;

    if (!school_id || !called_phone || !call_outcome) {
      return NextResponse.json({ error: 'school_id, called_phone, and call_outcome are required' }, { status: 400 });
    }

    const db = getDb();
    const logId = `call_${Date.now()}`;

    // 1. Insert into staff_calling_logs
    await db.execute({
      sql: `INSERT INTO staff_calling_logs (
        id, school_id, staff_name, called_phone, call_outcome,
        headmaster_confirmed, principal_desk_phone, whatsapp_confirmed, email_confirmed,
        notes, opt_out_requested, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [
        logId, school_id, staffName, called_phone, call_outcome,
        headmaster_confirmed || null, principal_desk_phone || null,
        whatsapp_confirmed || null, email_confirmed || null,
        notes || null, opt_out_requested ? 1 : 0
      ]
    });

    // 2. If outcome is VERIFIED_OFFICIAL_OFFICE, update school and contacts
    if (call_outcome === 'VERIFIED_OFFICIAL_OFFICE') {
      const updates: any[] = [];
      const setClauses: string[] = [];

      if (called_phone) {
        setClauses.push('official_landline = ?');
        updates.push(called_phone);
      }
      if (headmaster_confirmed) {
        setClauses.push('principal_name = ?');
        updates.push(headmaster_confirmed);
      }
      if (principal_desk_phone) {
        setClauses.push('principal_office_phone = ?');
        updates.push(principal_desk_phone);
      }
      if (whatsapp_confirmed) {
        setClauses.push('official_whatsapp = ?');
        updates.push(whatsapp_confirmed);
      }
      if (email_confirmed) {
        setClauses.push('official_email = ?');
        updates.push(email_confirmed);
      }

      setClauses.push("status = 'ACTIVE'", 'updated_at = CURRENT_TIMESTAMP');
      updates.push(school_id);

      if (setClauses.length > 2) {
        await db.execute({
          sql: `UPDATE schools SET ${setClauses.join(', ')} WHERE id = ?`,
          args: updates
        });
      }

      // Record Contact Verification
      await db.execute({
        sql: `INSERT INTO contact_verifications (id, contact_id, verification_method, evidence, verified_by, verification_result)
              VALUES (?, ?, 'STAFF_SWITCHBOARD_CALL', ?, ?, 'CONFIRMED')`,
        args: [
          `ver_staff_${Date.now()}`,
          `${school_id}_phone`,
          `Verified via outbound telephone call to ${called_phone}. Staff: ${staffName}. Outcome: ${call_outcome}. Notes: ${notes || 'Verified official school contact'}`,
          staffName
        ]
      });

      // Update provider stats for src_staff_switchboard
      await incrementProviderStats(PROVIDER_IDS.STAFF_SWITCHBOARD, {
        attempts: 1,
        matched: 1,
        discovered: 1,
        verified: 1
      });
    } else {
      // Unsuccessful call outcome logged
      await incrementProviderStats(PROVIDER_IDS.STAFF_SWITCHBOARD, {
        attempts: 1,
        matched: 1,
        discovered: 0,
        verified: 0
      });
    }

    // 3. If opt-out requested, record in opt_outs
    if (opt_out_requested) {
      await db.execute({
        sql: `INSERT INTO opt_outs (id, identifier_type, identifier_value, school_id, reason, requested_by)
              VALUES (?, 'phone', ?, ?, 'Staff switchboard call opt-out request', ?)`,
        args: [`opt_${Date.now()}`, called_phone, school_id, staffName]
      });
    }

    // 4. Audit Log
    await db.execute({
      sql: `INSERT INTO audit_logs (id, actor_id, action, record_type, record_id, created_at)
            VALUES (?, ?, 'STAFF_TELEPHONE_CALL_LOGGED', 'school', ?, CURRENT_TIMESTAMP)`,
      args: [`audit_${Date.now()}`, staffName, school_id]
    });

    return NextResponse.json({
      success: true,
      log_id: logId,
      school_id,
      call_outcome,
      staff_name: staffName,
      message: `Staff telephone call outcome '${call_outcome}' successfully recorded with audit log.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
