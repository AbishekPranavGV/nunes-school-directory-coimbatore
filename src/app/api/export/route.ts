import { NextRequest, NextResponse } from 'next/server';
import { getMasterSchoolsFromMemoryOrDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'filtered'; // 'all', 'filtered', 'missing', 'verification_report'
    const format = searchParams.get('format') || 'csv';
    const q = (searchParams.get('q') || '').toLowerCase().trim();
    const management = searchParams.get('management');
    const board = searchParams.get('board');
    const category = searchParams.get('category');
    const block = searchParams.get('block');
    const quick_filter = searchParams.get('quick_filter');

    const allSchools = await getMasterSchoolsFromMemoryOrDb();

    let targetSchools = allSchools;

    if (type === 'missing') {
      targetSchools = allSchools.filter((s: any) => !s.is_contact_complete);
    } else if (type === 'filtered') {
      targetSchools = allSchools.filter((s: any) => {
        if (q) {
          const matches = s.school_name.toLowerCase().includes(q) ||
                          s.udise_code.toLowerCase().includes(q) ||
                          s.block.toLowerCase().includes(q) ||
                          (s.village_locality || '').toLowerCase().includes(q) ||
                          s.pincode.toLowerCase().includes(q);
          if (!matches) return false;
        }
        if (management && s.management !== management) return false;
        if (board && s.board !== board) return false;
        if (category && s.category !== category) return false;
        if (block && s.block !== block) return false;

        if (quick_filter === 'no_contact' && s.is_contact_complete) return false;
        if (quick_filter === 'no_principal_office' && s.principal_office_phone) return false;
        if (quick_filter === 'no_whatsapp' && s.official_whatsapp) return false;
        if (quick_filter === 'no_email' && s.official_email) return false;
        if (quick_filter === 'complete' && !s.is_contact_complete) return false;
        if (quick_filter === 'needs_verification' && (s.workflow_state !== 'IN_RESEARCH' && s.workflow_state !== 'FOUND_UNVERIFIED' && s.workflow_state !== 'RECHECK_REQUIRED')) return false;

        return true;
      });
    }

    if (format === 'json') {
      return NextResponse.json({
        export_type: type,
        total_records: targetSchools.length,
        exported_at: new Date().toISOString(),
        schools: targetSchools
      });
    }

    // CSV format
    const headers = [
      'UDISE Code',
      'School Name',
      'Management / Type',
      'Board',
      'Category / Level',
      'Block',
      'Urban/Rural',
      'Village / Locality',
      'PIN Code',
      'Official Landline',
      'Official Mobile',
      'Official WhatsApp',
      'Official Email',
      'Principal Name',
      'Principal Office Phone',
      'Contact Completeness',
      'Workflow State',
      'Confidence',
      'Missing Reason',
      'Next Action',
      'Source Provenance'
    ];

    const rows = targetSchools.map((s: any) => [
      escapeCsv(s.udise_code),
      escapeCsv(s.school_name),
      escapeCsv(s.management),
      escapeCsv(s.board),
      escapeCsv(s.category),
      escapeCsv(s.block),
      escapeCsv(s.urban_rural),
      escapeCsv(s.village_locality || ''),
      escapeCsv(s.pincode),
      escapeCsv(s.official_landline || ''),
      escapeCsv(s.official_mobile || ''),
      escapeCsv(s.official_whatsapp || ''),
      escapeCsv(s.official_email || ''),
      escapeCsv(s.principal_name || ''),
      escapeCsv(s.principal_office_phone || ''),
      escapeCsv(s.is_contact_complete ? 'COMPLETE' : 'INCOMPLETE'),
      escapeCsv(s.workflow_state),
      escapeCsv(s.verification_confidence),
      escapeCsv(s.missing_reasons || ''),
      escapeCsv(s.next_action || ''),
      escapeCsv(s.source_provenance)
    ]);

    const csvContent = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\r\n');
    const filename = `nunes_coimbatore_schools_${type}_${Date.now()}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
