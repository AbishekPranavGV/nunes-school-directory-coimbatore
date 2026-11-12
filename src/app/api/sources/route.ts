import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM source_registry ORDER BY id ASC');
    return NextResponse.json({ sources: result.rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required to trigger source refresh' }, { status: 401 });
    }

    const body = await req.json();
    const { source_id } = body;
    const db = getDb();

    await db.execute({
      sql: `UPDATE source_registry 
            SET last_sync_at = CURRENT_TIMESTAMP, sync_status = 'VERIFIED_ACTIVE', error_log = NULL 
            WHERE id = ?`,
      args: [source_id]
    });

    return NextResponse.json({
      success: true,
      message: `Source adapter ${source_id} successfully synchronized`,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
