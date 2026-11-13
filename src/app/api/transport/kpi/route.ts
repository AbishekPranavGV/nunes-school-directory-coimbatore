import { NextRequest, NextResponse } from 'next/server';
import { TRANSPORT_OPERATORS, getTransportKPI } from '@/lib/data/transportData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district')?.toLowerCase().trim() || '';

    let dataset = TRANSPORT_OPERATORS;
    if (district && district !== 'all' && district !== 'statewide') {
      dataset = dataset.filter(d => d.district.toLowerCase() === district);
    }

    const kpi = getTransportKPI(dataset);

    return NextResponse.json({
      success: true,
      kpi,
      district: district || 'all'
    });
  } catch (err: any) {
    console.error('Error in /api/transport/kpi:', err);
    return NextResponse.json({ error: 'Failed to calculate transport KPI', details: err.message }, { status: 500 });
  }
}
