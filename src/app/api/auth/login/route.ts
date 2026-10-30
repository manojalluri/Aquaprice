import { NextRequest, NextResponse } from 'next/server';
import { findAdminByEmail } from '@/lib/db';
import { signAdminToken, COOKIE_NAME } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials or inactive account' },
        { status: 401 }
      );
    }

    const isMatch = bcrypt.compareSync(password, admin.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials or incorrect password' },
        { status: 401 }
      );
    }

    // Sign session token
    const token = await signAdminToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        name: admin.name,
      },
    });

    // Set secure cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

