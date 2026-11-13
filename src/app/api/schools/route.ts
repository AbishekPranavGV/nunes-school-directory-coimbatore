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
    const taluk = searchParams.get('taluk');
    const urban_rural = searchParams.get('urban_rural');
    const status = searchParams.get('status');
    const contact_status = searchParams.get('contact_status');
    const missing_queue_category = searchParams.get('missing_queue_category');
    const quick_filter = searchParams.get('quick_filter');

    // Boolean filters
    const has_phone = searchParams.get('has_phone');
    const has_principal_office = searchParams.get('has_principal_office');
    const has_whatsapp = searchParams.get('has_whatsapp');
    const has_email = searchParams.get('has_email');
    const has_missing_contact = searchParams.get('has_missing_contact');

    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '25', 10), 500);
    const sortBy = searchParams.get('sortBy') || 'school_name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

    const allSchools = await getMasterSchoolsFromMemoryOrDb();

    let filtered = allSchools.filter((s: any) => {
      // Global search across name, code, block, taluk, locality, address, PIN
      if (q) {
        const matchesName = s.school_name.toLowerCase().includes(q);
        const matchesUdise = s.udise_code.toLowerCase().includes(q);
        const matchesBlock = s.block.toLowerCase().includes(q);
        const matchesTaluk = (s.taluk || '').toLowerCase().includes(q);
        const matchesLocality = (s.locality || s.village_locality || '').toLowerCase().includes(q);
        const matchesPin = s.pincode.toLowerCase().includes(q);
        if (!matchesName && !matchesUdise && !matchesBlock && !matchesTaluk && !matchesLocality && !matchesPin) {
          return false;
        }
      }

      if (management && s.management !== management) return false;
      if (board && s.board !== board) return false;
      if (category && s.category !== category) return false;
      if (block && s.block !== block) return false;
      if (taluk && s.taluk !== taluk) return false;
      if (urban_rural && s.urban_rural !== urban_rural) return false;
      if (status && s.status !== status) return false;

      // Contact Status Filter
      if (contact_status && s.contact_status !== contact_status) return false;
      if (missing_queue_category && s.missing_queue_category !== missing_queue_category) return false;

      // Boolean filters
      if (has_phone === 'true' && !s.official_landline && !s.official_mobile) return false;
      if (has_principal_office === 'true' && !s.principal_office_phone) return false;
      if (has_whatsapp === 'true' && !s.official_whatsapp) return false;
      if (has_email === 'true' && !s.official_email) return false;
      if (has_missing_contact === 'true' && s.is_contact_complete) return false;

      // Quick filter presets
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
    const { 
      udise_code, school_name, management, board, category, classes_offered,
      block, taluk, address, locality, pincode, website 
    } = body;

    if (!udise_code || !school_name || !block || !pincode) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    const db = getDb();
    const id = `sch_custom_${Date.now()}`;
    const norm = school_name.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school_name + ' ' + block + ' Coimbatore')}`;

    await db.execute({
      sql: `INSERT INTO schools (
        id, udise_code, school_name, normalized_name, management_type, management, 
        board, school_level, category, classes_offered, address, locality, taluk, 
        education_block, block, district, state, urban_rural, pincode, google_maps_link, 
        website, source_provenance
      ) VALUES (
        ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, 'Coimbatore', 'Tamil Nadu', 'Urban', ?, ?, 
        ?, 'Admin Manual Entry'
      )`,
      args: [
        id, udise_code, school_name, norm, management || 'Private Unaided', management || 'Private Unaided',
        board || 'Tamil Nadu State Board', category || 'Primary', category || 'Primary', classes_offered || 'Classes 1 to 10', address || `${school_name}, ${block}`, locality || block, taluk || 'Coimbatore South',
        block, block, pincode, mapsLink, website || null
      ]
    });

    // Record audit
    await db.execute({
      sql: `INSERT INTO audit_logs (id, actor_id, action, record_type, record_id, created_at)
            VALUES (?, ?, 'CREATE_SCHOOL', 'school', ?, CURRENT_TIMESTAMP)`,
      args: [`audit_${Date.now()}`, user.username, id]
    });

    return NextResponse.json({ success: true, id, message: 'School created successfully' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
