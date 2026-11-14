import { NextRequest, NextResponse } from 'next/server';
import { TRANSPORT_OPERATORS, getTransportKPI } from '@/lib/data/transportData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district')?.toLowerCase().trim() || '';
    const state = searchParams.get('state')?.toLowerCase().trim() || '';

    let dataset = TRANSPORT_OPERATORS;
    if (state && state !== 'all') {
      dataset = dataset.filter(d => d.state.toLowerCase() === state || d.state.toLowerCase().includes(state));
    }
    if (district && district !== 'all' && district !== 'statewide') {
      dataset = dataset.filter(d => d.district.toLowerCase() === district);
    }

    const kpi = getTransportKPI(dataset);

    return NextResponse.json({
      success: true,
      kpi,
      district: district || 'all',
      state: state || 'all'
    });
  } catch (err: any) {
    console.error('Error in /api/transport/kpi:', err);
    return NextResponse.json({ error: 'Failed to calculate transport KPI', details: err.message }, { status: 500 });
  }
}
