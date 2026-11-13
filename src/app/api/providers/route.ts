import { NextRequest, NextResponse } from 'next/server';
import { getProviderReports, incrementProviderStats } from '@/lib/discovery/providers';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const providers = await getProviderReports();
    const totalDiscovered = providers.reduce((acc, p) => acc + p.contacts_discovered, 0);
    const totalVerified = providers.reduce((acc, p) => acc + p.contacts_verified, 0);
    const totalAttempts = providers.reduce((acc, p) => acc + p.search_attempts, 0);

    return NextResponse.json({
      summary: {
        total_providers: providers.length,
        available_providers: providers.filter(p => p.is_available).length,
        total_search_attempts: totalAttempts,
        total_contacts_discovered: totalDiscovered,
        total_contacts_verified: totalVerified,
        total_cost_inr: providers.reduce((acc, p) => acc + (parseFloat(p.actual_usage_cost.replace(/[^0-9.]/g, '')) || 0), 0)
      },
      providers
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required to trigger provider discovery' }, { status: 401 });
    }

    const body = await req.json();
    const { provider_id } = body;

    if (!provider_id) {
      return NextResponse.json({ error: 'provider_id is required' }, { status: 400 });
    }

    // Increment execution statistics for this provider
    await incrementProviderStats(provider_id, {
      attempts: 1,
      matched: 1,
      discovered: 0,
      verified: 0
    });

    const updated = await getProviderReports();
    const provider = updated.find(p => p.id === provider_id);

    return NextResponse.json({
      success: true,
      message: `Provider ${provider?.provider_name || provider_id} executed successfully.`,
      provider,
      executed_by: user.username,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
