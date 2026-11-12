import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT COUNT(*) as count FROM schools');
    const count = Number(result.rows[0]?.count || 0);

    return NextResponse.json({
      status: 'healthy',
      application: 'Nunes AI School Directory — Coimbatore District',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      country: 'India',
      target_records: 2097,
      imported_records: count,
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'degraded',
      error: err.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
