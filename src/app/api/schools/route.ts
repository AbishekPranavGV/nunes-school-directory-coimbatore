import { NextRequest, NextResponse } from 'next/server';
import { getMasterSchoolsFromMemoryOrDb, getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').toLowerCase().trim();
    const management = searchParams.get('management');
    const board = searchParams.get('board');
    const category = searchParams.get('category');
    const block = searchParams.get('block');
    const urban_rural = searchParams.get('urban_rural');
    const status = searchParams.get('status');
    const quick_filter = searchParams.get('quick_filter');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '25', 10), 500);
    const sortBy = searchParams.get('sortBy') || 'school_name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

    const allSchools = await getMasterSchoolsFromMemoryOrDb();

    let filtered = allSchools.filter((s: any) => {
      // Search across name, UDISE code, locality, block, and PIN
      if (q) {
        const matchesName = s.school_name.toLowerCase().includes(q);
        const matchesUdise = s.udise_code.toLowerCase().includes(q);
        const matchesBlock = s.block.toLowerCase().includes(q);
        const matchesLocality = (s.village_locality || '').toLowerCase().includes(q);
        const matchesPin = s.pincode.toLowerCase().includes(q);
        if (!matchesName && !matchesUdise && !matchesBlock && !matchesLocality && !matchesPin) {
          return false;
        }
      }

      if (management && s.management !== management) return false;
      if (board && s.board !== board) return false;
      if (category && s.category !== category) return false;
      if (block && s.block !== block) return false;
      if (urban_rural && s.urban_rural !== urban_rural) return false;
      if (status && s.status !== status) return false;

      // Quick filters per requirements
      if (quick_filter === 'no_contact' && s.is_contact_complete) return false;
      if (quick_filter === 'no_principal_office' && s.principal_office_phone) return false;
      if (quick_filter === 'no_whatsapp' && s.official_whatsapp) return false;
      if (quick_filter === 'no_email' && s.official_email) return false;
      if (quick_filter === 'complete' && !s.is_contact_complete) return false;
      if (quick_filter === 'needs_verification' && (s.workflow_state !== 'IN_RESEARCH' && s.workflow_state !== 'FOUND_UNVERIFIED' && s.workflow_state !== 'RECHECK_REQUIRED')) return false;

      return true;
    });

    // Sorting
    filtered.sort((a: any, b: any) => {
      let valA = a[sortBy] ?? '';
      let valB = b[sortBy] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return 0;
    });

    const totalCount = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      data: paginated,
      pagination: {
        page,
        pageSize,
        totalCount,
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
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Reviewer role required' }, { status: 401 });
    }

    const body = await req.json();
    const { udise_code, school_name, management, board, category, block, address, pincode } = body;

    if (!udise_code || !school_name || !block || !pincode) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    const db = getDb();
    const id = `sch_custom_${Date.now()}`;
    const norm = school_name.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();

    await db.execute({
      sql: `INSERT INTO schools (id, udise_code, school_name, normalized_name, management, board, category, block, urban_rural, address, pincode, source_provenance)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Admin Manual Entry')`,
      args: [id, udise_code, school_name, norm, management || 'Private Unaided', board || 'Tamil Nadu State Board', category || 'Primary', block, 'Urban', address || `${school_name}, ${block}`, pincode]
    });

    // Record audit
    await db.execute({
      sql: `INSERT INTO audit_log (id, user_id, action, entity_type, entity_id, change_details)
            VALUES (?, ?, 'CREATE_SCHOOL', 'school', ?, ?)`,
      args: [`audit_${Date.now()}`, user.id, id, `Added school ${school_name} (${udise_code})`]
    });

    return NextResponse.json({ success: true, id, message: 'School created successfully' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
