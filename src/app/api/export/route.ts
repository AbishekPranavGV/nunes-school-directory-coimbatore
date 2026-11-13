import { NextRequest, NextResponse } from 'next/server';
import { getMasterSchoolsFromMemoryOrDb } from '@/lib/db';
import ExcelJS from 'exceljs';

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
    const type = searchParams.get('type') || 'filtered'; // 'all', 'filtered', 'missing', 'verified', 'single'
    const format = searchParams.get('format') || 'csv';   // 'csv', 'xlsx', 'json'
    const school_id = searchParams.get('school_id');
    const district = searchParams.get('district');
    const q = (searchParams.get('q') || '').toLowerCase().trim();
    const management = searchParams.get('management');
    const board = searchParams.get('board');
    const category = searchParams.get('category');
    const block = searchParams.get('block');
    const taluk = searchParams.get('taluk');
    const quick_filter = searchParams.get('quick_filter');

    const allSchools = await getMasterSchoolsFromMemoryOrDb(district || undefined);

    // Single school export
    if (type === 'single' && school_id) {
      const single = allSchools.find((s: any) => s.id === school_id || s.udise_code === school_id);
      if (!single) return NextResponse.json({ error: 'School not found' }, { status: 404 });
      return NextResponse.json({ school: single, exported_at: new Date().toISOString() });
    }

    let targetSchools = allSchools;

    if (type === 'missing') {
      targetSchools = allSchools.filter((s: any) => !s.is_contact_complete);
    } else if (type === 'verified') {
      targetSchools = allSchools.filter((s: any) => s.is_contact_complete);
    } else if (type === 'filtered') {
      targetSchools = allSchools.filter((s: any) => {
        if (q) {
          const matches = s.school_name.toLowerCase().includes(q) ||
                          s.udise_code.toLowerCase().includes(q) ||
                          s.block.toLowerCase().includes(q) ||
                          (s.taluk || '').toLowerCase().includes(q) ||
                          (s.village_locality || '').toLowerCase().includes(q) ||
                          s.pincode.toLowerCase().includes(q);
          if (!matches) return false;
        }
        if (district && district.toLowerCase() !== 'all' && district.toLowerCase() !== 'statewide') {
          if ((s.district || '').toLowerCase() !== district.toLowerCase() && 
              (s.district || '').toLowerCase().replace(/\s+/g, '') !== district.toLowerCase().replace(/\s+/g, '')) {
            return false;
          }
        }
        if (management && s.management !== management) return false;
        if (board && s.board !== board) return false;
        if (category && s.category !== category) return false;
        if (block && s.block !== block) return false;
        if (taluk && s.taluk !== taluk) return false;

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

    // EXCEL (.XLSX) Export using ExcelJS
    if (format === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Nunes Instruments';
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet('Coimbatore Schools', {
        views: [{ state: 'frozen', ySplit: 1 }]
      });

      worksheet.columns = [
        { header: 'UDISE Code', key: 'udise', width: 16 },
        { header: 'School Name', key: 'name', width: 36 },
        { header: 'Management', key: 'management', width: 24 },
        { header: 'Board', key: 'board', width: 22 },
        { header: 'Level', key: 'category', width: 20 },
        { header: 'Classes Offered', key: 'classes', width: 25 },
        { header: 'Taluk', key: 'taluk', width: 18 },
        { header: 'Educational Block', key: 'block', width: 20 },
        { header: 'PIN Code', key: 'pin', width: 12 },
        { header: 'Official Landline', key: 'landline', width: 20 },
        { header: 'Official Mobile', key: 'mobile', width: 20 },
        { header: 'WhatsApp Business', key: 'whatsapp', width: 22 },
        { header: 'Official Email', key: 'email', width: 28 },
        { header: 'Principal Name', key: 'principal', width: 24 },
        { header: 'Principal Office Desk', key: 'principal_office', width: 22 },
        { header: 'Google Maps Link', key: 'maps', width: 35 },
        { header: 'Contact Status', key: 'status', width: 20 },
        { header: 'Confidence Score', key: 'confidence', width: 16 },
        { header: 'Source Provenance', key: 'source', width: 25 }
      ];

      // Header row styling
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0284C7' } // Sky-600
      };

      for (const s of targetSchools) {
        worksheet.addRow({
          udise: s.udise_code,
          name: s.school_name,
          management: s.management,
          board: s.board,
          category: s.category,
          classes: s.classes_offered || '',
          taluk: s.taluk || '',
          block: s.block,
          pin: s.pincode,
          landline: s.official_landline || '',
          mobile: s.official_mobile || '',
          whatsapp: s.official_whatsapp || '',
          email: s.official_email || '',
          principal: s.principal_name || '',
          principal_office: s.principal_office_phone || '',
          maps: s.google_maps_link || '',
          status: s.contact_status || (s.is_contact_complete ? 'CONTACT_COMPLETE' : 'CONTACT_MISSING'),
          confidence: s.confidence_score !== undefined ? `${(s.confidence_score * 100).toFixed(0)}%` : '0%',
          source: s.source_provenance || ''
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const filename = `nunes_coimbatore_schools_${type}_${Date.now()}.xlsx`;

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }

    // CSV format
    const headers = [
      'UDISE Code',
      'School Name',
      'Management / Type',
      'Board',
      'Category / Level',
      'Classes Offered',
      'Taluk',
      'Educational Block',
      'Urban/Rural',
      'Village / Locality',
      'PIN Code',
      'Official Landline',
      'Official Mobile',
      'Official WhatsApp',
      'Official Email',
      'Principal Name',
      'Principal Office Phone',
      'Google Maps Link',
      'Contact Status',
      'Missing Queue Category',
      'Confidence Score',
      'Source Provenance'
    ];

    const rows = targetSchools.map((s: any) => [
      escapeCsv(s.udise_code),
      escapeCsv(s.school_name),
      escapeCsv(s.management),
      escapeCsv(s.board),
      escapeCsv(s.category),
      escapeCsv(s.classes_offered || ''),
      escapeCsv(s.taluk || ''),
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
      escapeCsv(s.google_maps_link || ''),
      escapeCsv(s.contact_status || (s.is_contact_complete ? 'CONTACT_COMPLETE' : 'CONTACT_MISSING')),
      escapeCsv(s.missing_queue_category || ''),
      escapeCsv(s.confidence_score !== undefined ? s.confidence_score : 0.0),
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
