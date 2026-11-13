import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPassword, createToken, COOKIE_NAME, FORBIDDEN_PASSWORDS } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    if (FORBIDDEN_PASSWORDS.includes(password)) {
      return NextResponse.json({ 
        error: 'Default administrator credentials have been permanently disabled for security. Please use the configured secure administrator password.' 
      }, { status: 401 });
    }

    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT id, username, email, password_hash, role FROM users WHERE username = ? OR email = ?',
      args: [username, username]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userRow: any = result.rows[0];
    const valid = checkPassword(password, userRow.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken({
      id: userRow.id,
      username: userRow.username,
      email: userRow.email,
      role: userRow.role
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: userRow.id,
        username: userRow.username,
        email: userRow.email,
        role: userRow.role
      },
      token
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
