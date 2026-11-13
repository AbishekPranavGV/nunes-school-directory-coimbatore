import { NextRequest, NextResponse } from 'next/server';
import { TRANSPORT_OPERATORS } from '@/lib/data/transportData';
import { TransportRecord } from '@/types/transport';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q')?.toLowerCase().trim() || '';
    const serviceType = searchParams.get('service_type')?.toLowerCase().trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const district = searchParams.get('district')?.toLowerCase().trim() || '';
    const permitType = searchParams.get('permit_type')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const quickFilter = searchParams.get('quick')?.toLowerCase().trim() || '';

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const sortBy = searchParams.get('sortBy') || 'company_name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    let filtered: TransportRecord[] = [...TRANSPORT_OPERATORS];

    // Service type filter (bus, lorry, logistics)
    if (serviceType && serviceType !== 'all') {
      if (serviceType === 'lorry') {
        filtered = filtered.filter(item => item.service_type === 'lorry' || item.service_type === 'logistics');
      } else {
        filtered = filtered.filter(item => item.service_type === serviceType);
      }
    }

    // Category filter
    if (category && category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }

    // District filter
    if (district && district !== 'all' && district !== 'statewide') {
      filtered = filtered.filter(item => item.district.toLowerCase() === district);
    }

    // Permit Type filter
    if (permitType && permitType !== 'all') {
      filtered = filtered.filter(item => item.permit_type === permitType);
    }

    // Verification status filter
    if (status && status !== 'all') {
      filtered = filtered.filter(item => item.verification_status === status);
    }

    // Quick filter chips
    if (quickFilter) {
      if (quickFilter === 'has_whatsapp') {
        filtered = filtered.filter(item => Boolean(item.whatsapp_number && item.whatsapp_number.length >= 10));
      } else if (quickFilter === 'has_email') {
        filtered = filtered.filter(item => Boolean(item.email && item.email.includes('@')));
      } else if (quickFilter === 'bus_services') {
        filtered = filtered.filter(item => item.service_type === 'bus');
      } else if (quickFilter === 'lorry_services') {
        filtered = filtered.filter(item => item.service_type === 'lorry' || item.service_type === 'logistics');
      } else if (quickFilter === 'namakkal_hub') {
        filtered = filtered.filter(item => item.district.toLowerCase() === 'namakkal' || item.city_hub.toLowerCase().includes('namakkal'));
      } else if (quickFilter === 'coimbatore_hub') {
        filtered = filtered.filter(item => item.district.toLowerCase() === 'coimbatore');
      } else if (quickFilter === 'national_permit') {
        filtered = filtered.filter(item => item.permit_type.includes('National') || item.permit_type.includes('All India'));
      }
    }

    // Free text search
    if (query) {
      filtered = filtered.filter(item => {
        return (
          item.company_name.toLowerCase().includes(query) ||
          item.owner_name.toLowerCase().includes(query) ||
          item.contact_number.toLowerCase().includes(query) ||
          item.whatsapp_number.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.city_hub.toLowerCase().includes(query) ||
          item.district.toLowerCase().includes(query) ||
          item.address.toLowerCase().includes(query) ||
          item.routes.some(r => r.toLowerCase().includes(query)) ||
          item.vehicle_types.some(v => v.toLowerCase().includes(query)) ||
          (item.gstin && item.gstin.toLowerCase().includes(query))
        );
      });
    }

    // Sorting
    filtered.sort((a: any, b: any) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    // Pagination
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      success: true,
      data: paginated,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (err: any) {
    console.error('Error in /api/transport:', err);
    return NextResponse.json({ error: 'Failed to fetch transport data', details: err.message }, { status: 500 });
  }
}
