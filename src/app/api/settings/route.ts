import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getProviderReports } from '@/lib/discovery/providers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const providers = await getProviderReports();

    const safetyStatus = {
      EMAIL_AUTOMATION_ENABLED: false,
      WHATSAPP_AUTOMATION_ENABLED: false,
      LIVE_SEND_ENABLED: false,
      SCHEDULED_SEND_ENABLED: false,
      ALLOWLIST_INTERNAL_ONLY: true,
      STRICT_NON_FABRICATION_POLICY: 'ACTIVE',
      ZERO_STUDENT_DATA_POLICY: 'ENFORCED',
      E164_PHONE_STANDARDIZATION: 'ENFORCED',
      DNS_MX_VERIFICATION: 'ACTIVE',
      SERVERLESS_WRITABLE_CACHE: 'ACTIVE (/tmp/schools.db)'
    };

    const districtOverview = {
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      country: 'India',
      total_target_schools: 2097,
      verified_contacts_count: 77,
      missing_contacts_queue: 2020,
      total_blocks: 15,
      total_taluks: 11,
      blocks: [
        'Coimbatore North', 'Coimbatore South', 'Pollachi North', 'Pollachi South',
        'Sulur', 'Annur', 'Mettupalayam', 'Karamadai', 'Madukkarai', 'Perur',
        'Thondamuthur', 'Kinathukadavu', 'Anaimalai', 'Valparai', 'Sultanpet'
      ],
      taluks: [
        'Coimbatore North', 'Coimbatore South', 'Pollachi', 'Mettupalayam',
        'Sulur', 'Annur', 'Madukkarai', 'Perur', 'Kinathukadavu', 'Anaimalai', 'Valparai'
      ]
    };

    return NextResponse.json({
      safety_status: safetyStatus,
      district_overview: districtOverview,
      providers_count: providers.length,
      current_user: user ? {
        username: user.username,
        role: user.role
      } : null,
      server_time: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
