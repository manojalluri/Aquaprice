import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { changeAdminPassword } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { new_password, confirm_password } = body;

    if (!new_password || new_password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (new_password !== confirm_password) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const success = await changeAdminPassword(session.id, new_password);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. Please use your new password next time you log in.',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}

