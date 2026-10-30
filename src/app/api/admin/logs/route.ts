import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAdminActivityLogs } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await getAdminActivityLogs(30);
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch logs' }, { status: 500 });
  }
}

