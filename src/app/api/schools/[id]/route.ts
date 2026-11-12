import { NextRequest, NextResponse } from 'next/server';
import { getMasterSchoolsFromMemoryOrDb, getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const schools = await getMasterSchoolsFromMemoryOrDb();
    const school = schools.find((s: any) => s.id === id || s.udise_code === id);

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    return NextResponse.json({ school });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Reviewer role required' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const db = getDb();

    // Check school exists
    const check = await db.execute({
      sql: 'SELECT id, school_name FROM schools WHERE id = ? OR udise_code = ?',
      args: [id, id]
    });

    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'School not found in database' }, { status: 404 });
    }

    const schoolId = String(check.rows[0].id);
    const schoolName = String(check.rows[0].school_name);

    // Update contacts if provided
    const contactUpdates = [
      { type: 'landline', val: body.official_landline },
      { type: 'mobile', val: body.official_mobile },
      { type: 'whatsapp', val: body.official_whatsapp },
      { type: 'email', val: body.official_email },
      { type: 'principal_name', val: body.principal_name },
      { type: 'principal_office_phone', val: body.principal_office_phone }
    ];

    let hasAnyContact = false;
    for (const c of contactUpdates) {
      if (c.val !== undefined) {
        if (c.val) {
          hasAnyContact = true;
          await db.execute({
            sql: `INSERT OR REPLACE INTO contacts (
              id, school_id, contact_type, contact_value, formatted_value, is_verified, 
              verification_source, verification_status, confidence_score, verified_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, 1, 'Staff Verified Contact Update', 'OFFICIAL_CONFIRMED', 0.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            args: [`${schoolId}_${c.type}`, schoolId, c.type, c.val, c.val]
          });
        } else {
          // Empty string / null means remove
          await db.execute({
            sql: 'DELETE FROM contacts WHERE school_id = ? AND contact_type = ?',
            args: [schoolId, c.type]
          });
        }
      }
    }

    // Update work queue state
    const newState = body.workflow_state || (hasAnyContact ? 'VERIFIED_INSTITUTION_CONTACT' : undefined);
    if (newState) {
      await db.execute({
        sql: `UPDATE contact_work_queue 
              SET workflow_state = ?, is_contact_complete = ?, missing_reasons = ?, next_action = ?, assigned_staff = ?, reviewed_by = ?, updated_at = CURRENT_TIMESTAMP
              WHERE school_id = ?`,
        args: [
          newState, 
          (newState === 'VERIFIED_INSTITUTION_CONTACT' || newState === 'PRINCIPAL_OFFICE_VERIFIED') ? 1 : 0,
          body.missing_reasons || '', 
          body.next_action || 'Review completed', 
          user.username, 
          user.username,
          schoolId
        ]
      });
    }

    // Record audit log
    await db.execute({
      sql: `INSERT INTO audit_log (id, user_id, action, entity_type, entity_id, change_details)
            VALUES (?, ?, 'UPDATE_SCHOOL_CONTACTS', 'school', ?, ?)`,
      args: [
        `audit_${Date.now()}`, 
        user.id, 
        schoolId, 
        `Updated contact details for ${schoolName}. State: ${newState || 'Updated'}`
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'School contacts updated successfully',
      schoolId
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
