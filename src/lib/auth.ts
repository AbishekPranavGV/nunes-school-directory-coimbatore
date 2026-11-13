import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'nunes-ai-school-directory-jwt-secret-key-coimbatore-2026'
);

const COOKIE_NAME = 'nunes_auth_session';

export const FORBIDDEN_PASSWORDS = [
  'NunesInstruments2026!',
  'admin',
  'password',
  '123456',
  'nunes',
  'admin123'
];

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'reviewer' | 'viewer';
}

export async function createToken(user: AuthUser): Promise<string> {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as AuthUser;
  } catch (err) {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest): Promise<AuthUser | null> {
  try {
    let token: string | undefined;

    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
      if (!token) {
        token = req.cookies.get(COOKIE_NAME)?.value;
      }
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    }

    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export function checkPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export { COOKIE_NAME };
