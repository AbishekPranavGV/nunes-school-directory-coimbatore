import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Reviewer role required' }, { status: 401 });
    }

    const { id: schoolId } = await context.params;
    const body = await req.json();
    const {
      call_outcome,        // 'SPOKE_WITH_PRINCIPAL', 'SWITCHBOARD_VERIFIED', 'NO_ANSWER', 'BUSY', 'WRONG_NUMBER', 'OPT_OUT_REQUESTED'
      notes,
      verified_phone,
      verified_email,
      verified_principal,
      consent_obtained,     // boolean
      request_opt_out,      // boolean
      follow_up_date
    } = body;

    const db = getDb();

    // Check school
    const check = await db.execute({
      sql: 'SELECT id, school_name, udise_code FROM schools WHERE id = ? OR udise_code = ?',
      args: [schoolId, schoolId]
    });

    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    const realId = String(check.rows[0].id);
    const schoolName = String(check.rows[0].school_name);

    // If opt-out requested, add to opt_outs table
    if (request_opt_out) {
      await db.execute({
        sql: `INSERT INTO opt_outs (id, identifier_type, identifier_value, school_id, reason, requested_by)
              VALUES (?, 'phone', ?, ?, 'Institution requested exclusion from contact directory', ?)`,
        args: [`opt_${Date.now()}`, verified_phone || 'ALL_CHANNELS', realId, user.username]
      });
    }

    let newState = 'IN_RESEARCH';
    let isComplete = 0;

    if (request_opt_out) {
      newState = 'NO_PUBLIC_CONTACT_FOUND';
    } else if (call_outcome === 'SPOKE_WITH_PRINCIPAL' || call_outcome === 'SWITCHBOARD_VERIFIED') {
      if (verified_phone || verified_email) {
        newState = 'VERIFIED_INSTITUTION_CONTACT';
        isComplete = 1;

        if (verified_phone) {
          await db.execute({
            sql: `INSERT OR REPLACE INTO contacts (id, school_id, contact_type, contact_value, formatted_value, is_verified, verification_source, verification_status, confidence_score, verified_at)
                  VALUES (?, ?, 'landline', ?, ?, 1, 'Manual Outbound Switchboard Call', 'OFFICIAL_CONFIRMED', 1.0, CURRENT_TIMESTAMP)`,
            args: [`${realId}_landline`, realId, verified_phone, verified_phone]
          });
        }
        if (verified_email) {
          await db.execute({
            sql: `INSERT OR REPLACE INTO contacts (id, school_id, contact_type, contact_value, formatted_value, is_verified, verification_source, verification_status, confidence_score, verified_at)
                  VALUES (?, ?, 'email', ?, ?, 1, 'Manual Outbound Switchboard Call', 'OFFICIAL_CONFIRMED', 1.0, CURRENT_TIMESTAMP)`,
            args: [`${realId}_email`, realId, verified_email, verified_email]
          });
        }
        if (verified_principal) {
          await db.execute({
            sql: `INSERT OR REPLACE INTO contacts (id, school_id, contact_type, contact_value, formatted_value, is_verified, verification_source, verification_status, confidence_score, verified_at)
                  VALUES (?, ?, 'principal_name', ?, ?, 1, 'Manual Outbound Switchboard Call', 'OFFICIAL_CONFIRMED', 1.0, CURRENT_TIMESTAMP)`,
            args: [`${realId}_principal_name`, realId, verified_principal, verified_principal]
          });
        }
      }
    } else if (call_outcome === 'NO_ANSWER' || call_outcome === 'BUSY') {
      newState = 'RECHECK_REQUIRED';
    } else if (call_outcome === 'WRONG_NUMBER') {
      newState = 'NO_PUBLIC_CONTACT_FOUND';
    }

    // Update work queue
    const auditEntry = `[${new Date().toISOString()}] Call by ${user.username} | Outcome: ${call_outcome} | Consent: ${consent_obtained ? 'YES' : 'NO'} | Notes: ${notes || 'None'}`;
    await db.execute({
      sql: `UPDATE contact_work_queue 
            SET workflow_state = ?, is_contact_complete = ?, call_outcome = ?, attempted_date = CURRENT_TIMESTAMP, 
                follow_up_date = ?, reviewed_by = ?, audit_trail = audit_trail || '\n' || ?, updated_at = CURRENT_TIMESTAMP
            WHERE school_id = ?`,
      args: [newState, isComplete, call_outcome, follow_up_date || null, user.username, auditEntry, realId]
    });

    // Record audit log
    await db.execute({
      sql: `INSERT INTO audit_log (id, user_id, action, entity_type, entity_id, change_details)
            VALUES (?, ?, 'LOG_OUTBOUND_CALL', 'school', ?, ?)`,
      args: [`audit_${Date.now()}`, user.id, realId, `Staff call to ${schoolName}. Outcome: ${call_outcome}`]
    });

    return NextResponse.json({
      success: true,
      message: 'Outbound call attempt recorded successfully',
      newState,
      isComplete: Boolean(isComplete)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
