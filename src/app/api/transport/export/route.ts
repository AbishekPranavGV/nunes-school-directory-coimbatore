import { NextRequest, NextResponse } from 'next/server';
import { TRANSPORT_OPERATORS } from '@/lib/data/transportData';
import ExcelJS from 'exceljs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format')?.toLowerCase() || 'csv';
    const district = searchParams.get('district')?.toLowerCase().trim() || '';
    const serviceType = searchParams.get('service_type')?.toLowerCase().trim() || '';

    let dataset = [...TRANSPORT_OPERATORS];

    if (district && district !== 'all' && district !== 'statewide') {
      dataset = dataset.filter(d => d.district.toLowerCase() === district);
    }

    if (serviceType && serviceType !== 'all') {
      if (serviceType === 'lorry') {
        dataset = dataset.filter(item => item.service_type === 'lorry' || item.service_type === 'logistics');
      } else {
        dataset = dataset.filter(item => item.service_type === serviceType);
      }
    }

    if (format === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Nunes Instruments Transport Intelligence';
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet('Transport Operators');

      worksheet.columns = [
        { header: 'Operator ID', key: 'id', width: 14 },
        { header: 'Company Name', key: 'company_name', width: 35 },
        { header: 'Category', key: 'category', width: 30 },
        { header: 'Service Type', key: 'service_type', width: 15 },
        { header: 'Owner / MD Name', key: 'owner_name', width: 28 },
        { header: 'Designation', key: 'owner_designation', width: 24 },
        { header: 'Primary Phone', key: 'contact_number', width: 20 },
        { header: 'WhatsApp Number', key: 'whatsapp_number', width: 20 },
        { header: 'Email ID / Gmail', key: 'email', width: 32 },
        { header: 'City / Hub', key: 'city_hub', width: 28 },
        { header: 'District', key: 'district', width: 18 },
        { header: 'Operating Routes', key: 'routes', width: 45 },
        { header: 'Fleet Size', key: 'fleet_size', width: 25 },
        { header: 'Vehicle Types', key: 'vehicle_types', width: 35 },
        { header: 'Permit Type', key: 'permit_type', width: 25 },
        { header: 'GSTIN', key: 'gstin', width: 20 },
        { header: 'Verification Status', key: 'verification_status', width: 18 },
        { header: 'Address', key: 'address', width: 45 }
      ];

      // Format header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0284C7' } // Sky blue 600
      };

      dataset.forEach(item => {
        worksheet.addRow({
          id: item.id,
          company_name: item.company_name,
          category: item.category,
          service_type: item.service_type.toUpperCase(),
          owner_name: item.owner_name,
          owner_designation: item.owner_designation,
          contact_number: item.contact_number,
          whatsapp_number: item.whatsapp_number,
          email: item.email,
          city_hub: item.city_hub,
          district: item.district,
          routes: item.routes.join('; '),
          fleet_size: item.fleet_size,
          vehicle_types: item.vehicle_types.join(', '),
          permit_type: item.permit_type,
          gstin: item.gstin || 'N/A',
          verification_status: item.verification_status,
          address: item.address
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="tamil_nadu_transport_fleets_${new Date().toISOString().slice(0, 10)}.xlsx"`
        }
      });
    }

    // Default CSV format
    const headers = [
      'ID',
      'Company Name',
      'Category',
      'Service Type',
      'Owner / MD Name',
      'Designation',
      'Contact Number',
      'WhatsApp Number',
      'Email / Gmail ID',
      'City / Hub',
      'District',
      'Fleet Size',
      'Vehicle Types',
      'Permit Type',
      'GSTIN',
      'Verification Status',
      'Operating Routes',
      'Address'
    ];

    const escapeCsv = (str: string | undefined | null) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = dataset.map(item => [
      escapeCsv(item.id),
      escapeCsv(item.company_name),
      escapeCsv(item.category),
      escapeCsv(item.service_type.toUpperCase()),
      escapeCsv(item.owner_name),
      escapeCsv(item.owner_designation),
      escapeCsv(item.contact_number),
      escapeCsv(item.whatsapp_number),
      escapeCsv(item.email),
      escapeCsv(item.city_hub),
      escapeCsv(item.district),
      escapeCsv(item.fleet_size),
      escapeCsv(item.vehicle_types.join(', ')),
      escapeCsv(item.permit_type),
      escapeCsv(item.gstin || 'N/A'),
      escapeCsv(item.verification_status),
      escapeCsv(item.routes.join('; ')),
      escapeCsv(item.address)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="tamil_nadu_transport_fleets_${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });
  } catch (err: any) {
    console.error('Error in /api/transport/export:', err);
    return NextResponse.json({ error: 'Failed to export transport data', details: err.message }, { status: 500 });
  }
}
