import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }
    return NextResponse.json({ authenticated: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
