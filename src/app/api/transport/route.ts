import { NextRequest, NextResponse } from 'next/server';
import { TRANSPORT_OPERATORS } from '@/lib/data/transportData';
import { TransportRecord } from '@/types/transport';

// In-memory mutable cache so edits persist during session
let operatorsCache: TransportRecord[] = [...TRANSPORT_OPERATORS];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q')?.toLowerCase().trim() || '';
    const state = searchParams.get('state')?.toLowerCase().trim() || '';
    const serviceType = searchParams.get('service_type')?.toLowerCase().trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const district = searchParams.get('district')?.toLowerCase().trim() || '';
    const permitType = searchParams.get('permit_type')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const quickFilter = searchParams.get('quick')?.toLowerCase().trim() || '';
    const branchCity = searchParams.get('branch_city')?.toLowerCase().trim() || '';

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const sortBy = searchParams.get('sortBy') || 'company_name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Ensure cache has the full dataset
    if (operatorsCache.length < TRANSPORT_OPERATORS.length) {
      operatorsCache = [...TRANSPORT_OPERATORS];
    }

    let filtered: TransportRecord[] = [...operatorsCache];

    // State filter (Tamil Nadu, Kerala, or all)
    if (state && state !== 'all') {
      filtered = filtered.filter(item => 
        item.state.toLowerCase() === state ||
        item.state.toLowerCase().includes(state)
      );
    }

    // Service type filter (bus, lorry, logistics, govt)
    if (serviceType && serviceType !== 'all') {
      filtered = filtered.filter(item => item.service_type === serviceType);
    }

    // Category filter
    if (category && category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }

    // District filter
    if (district && district !== 'all' && district !== 'statewide') {
      filtered = filtered.filter(item => 
        item.district.toLowerCase() === district ||
        item.branches?.some(b => b.district.toLowerCase() === district)
      );
    }

    // Branch City filter
    if (branchCity && branchCity !== 'all') {
      filtered = filtered.filter(item => 
        item.city_hub.toLowerCase().includes(branchCity) ||
        item.branches?.some(b => b.city.toLowerCase() === branchCity)
      );
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
        filtered = filtered.filter(item => 
          item.district.toLowerCase() === 'namakkal' || 
          item.city_hub.toLowerCase().includes('namakkal') ||
          item.branches?.some(b => b.city.toLowerCase().includes('namakkal'))
        );
      } else if (quickFilter === 'coimbatore_hub') {
        filtered = filtered.filter(item => 
          item.district.toLowerCase() === 'coimbatore' ||
          item.branches?.some(b => b.city.toLowerCase().includes('coimbatore'))
        );
      } else if (quickFilter === 'national_permit') {
        filtered = filtered.filter(item => item.permit_type.includes('National') || item.permit_type.includes('All India'));
      } else if (quickFilter === 'has_branches') {
        filtered = filtered.filter(item => Boolean(item.branches && item.branches.length > 0));
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
          (item.gstin && item.gstin.toLowerCase().includes(query)) ||
          item.branches?.some(b => 
            b.branch_name.toLowerCase().includes(query) || 
            b.city.toLowerCase().includes(query) || 
            b.manager_name.toLowerCase().includes(query) ||
            b.phone.toLowerCase().includes(query)
          )
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, operator } = body;

    if (action === 'edit_operator' && operator && operator.id) {
      const idx = operatorsCache.findIndex(o => o.id === operator.id);
      if (idx !== -1) {
        operatorsCache[idx] = {
          ...operatorsCache[idx],
          ...operator,
          updated_at: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          message: `Operator ${operator.company_name} updated successfully`,
          operator: operatorsCache[idx]
        });
      }
      return NextResponse.json({ error: 'Operator not found' }, { status: 404 });
    }

    if (action === 'add_branch' && body.operator_id && body.branch) {
      const idx = operatorsCache.findIndex(o => o.id === body.operator_id);
      if (idx !== -1) {
        const newBranch = {
          id: `BR-${Date.now().toString().slice(-6)}`,
          ...body.branch
        };
        if (!operatorsCache[idx].branches) {
          operatorsCache[idx].branches = [];
        }
        operatorsCache[idx].branches.push(newBranch);
        operatorsCache[idx].updated_at = new Date().toISOString();

        return NextResponse.json({
          success: true,
          message: 'Branch added successfully',
          branch: newBranch,
          operator: operatorsCache[idx]
        });
      }
      return NextResponse.json({ error: 'Operator not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in /api/transport POST:', err);
    return NextResponse.json({ error: 'Failed to update transport data', details: err.message }, { status: 500 });
  }
}
