import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'aquaprice_super_secure_jwt_secret_token_key_2026_andhra_aqua';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'aquaprice_admin_token';

export interface AdminSession {
  id: string;
  email: string;
  role: 'buyer' | 'super_admin';
  name?: string;
}

/**
 * Signs a JWT session token for an admin
 */
export async function signAdminToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Verifies a JWT token and returns the session payload
 */
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as 'buyer' | 'super_admin',
      name: payload.name as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Server-side helper to get current admin session from incoming NextRequest or cookies
 */
export async function getAdminSession(request?: NextRequest): Promise<AdminSession | null> {
  try {
    let token: string | undefined;

    if (request) {
      // Check Authorization Header
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
      // Check Cookies in request
      if (!token) {
        token = request.cookies.get(COOKIE_NAME)?.value;
      }
    }

    // Fallback to Next.js cookies()
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    }

    if (!token) return null;

    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export { COOKIE_NAME };

