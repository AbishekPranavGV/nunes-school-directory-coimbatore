import { NextRequest, NextResponse } from 'next/server';
import { getMasterSchoolsFromMemoryOrDb } from '@/lib/db';
import ExcelJS from 'exceljs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const block = searchParams.get('block') || '';
    const format = searchParams.get('format') || 'xlsx';

    const allSchools = await getMasterSchoolsFromMemoryOrDb();

    let targetSchools = allSchools;
    if (block) {
      targetSchools = targetSchools.filter((s: any) => 
        s.block?.toLowerCase() === block.toLowerCase() || 
        s.education_block?.toLowerCase() === block.toLowerCase()
      );
    }

    // Sort by block then school name
    targetSchools.sort((a: any, b: any) => {
      const bComp = (a.block || '').localeCompare(b.block || '');
      if (bComp !== 0) return bComp;
      return (a.school_name || '').localeCompare(b.school_name || '');
    });

    if (format === 'csv') {
      const headers = [
        'UDISE Code',
        'School Name',
        'Educational Block',
        'Taluk',
        'Management',
        'Board',
        'Existing Telephone / Contact',
        'Headmaster / Principal on Record',
        'Call Question 1: Official School Office Confirmed? (Y/N)',
        'Call Question 2: Verified Telephone Number',
        'Call Question 3: Principal Desk Extension',
        'Call Question 4: Institutional WhatsApp Business Number',
        'Call Question 5: Official Domain Email',
        'Call Outcome (VERIFIED / BUSY / NO_ANSWER / WRONG_NUMBER / FLAGGED)',
        'Staff Notes'
      ];

      const rows = targetSchools.map((s: any) => [
        s.udise_code,
        `"${(s.school_name || '').replace(/"/g, '""')}"`,
        `"${s.block || ''}"`,
        `"${s.taluk || ''}"`,
        `"${s.management || ''}"`,
        `"${s.board || ''}"`,
        `"${s.official_landline || s.official_mobile || 'Not publicly available'}"`,
        `"${s.principal_name || 'Not published'}"`,
        '', // Q1
        '', // Q2
        '', // Q3
        '', // Q4
        '', // Q5
        '', // Outcome
        ''  // Notes
      ]);

      const csvContent = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="Coimbatore_Schools_Staff_Calling_Worksheet_${block || 'All_Blocks'}_2026.csv"`
        }
      });
    }

    // Excel (.xlsx) using exceljs
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Nunes Instruments School Intelligence Platform';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Calling Worksheet', {
      pageSetup: { orientation: 'landscape', paperSize: 9 }
    });

    worksheet.columns = [
      { header: 'UDISE Code', key: 'udise_code', width: 14 },
      { header: 'School Name', key: 'school_name', width: 34 },
      { header: 'Block', key: 'block', width: 18 },
      { header: 'Taluk', key: 'taluk', width: 18 },
      { header: 'Management', key: 'management', width: 22 },
      { header: 'Existing Contact', key: 'existing_contact', width: 24 },
      { header: 'Headmaster on Record', key: 'headmaster', width: 24 },
      { header: 'Q1: Official Office? (Y/N)', key: 'q1', width: 22 },
      { header: 'Q2: Verified Telephone', key: 'q2', width: 22 },
      { header: 'Q3: Principal Desk Line', key: 'q3', width: 22 },
      { header: 'Q4: WhatsApp Business', key: 'q4', width: 22 },
      { header: 'Q5: Official Email', key: 'q5', width: 24 },
      { header: 'Call Outcome', key: 'outcome', width: 20 },
      { header: 'Staff Caller Notes', key: 'notes', width: 30 }
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0284C7' } // Sky-600
      };
      cell.font = {
        name: 'Arial',
        color: { argb: 'FFFFFFFF' },
        bold: true,
        size: 10
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    targetSchools.forEach((s: any) => {
      worksheet.addRow({
        udise_code: s.udise_code,
        school_name: s.school_name,
        block: s.block,
        taluk: s.taluk,
        management: s.management,
        existing_contact: s.official_landline || s.official_mobile || 'Not publicly available',
        headmaster: s.principal_name || 'Not published',
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
        outcome: '',
        notes: ''
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Coimbatore_Staff_Calling_Worksheet_${block || 'District'}_2026.xlsx"`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
