import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAllCounts, createCount } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const counts = await getAllCounts();
    return NextResponse.json({ success: true, data: counts });
  } catch (error) {
    console.error('Error fetching counts:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch counts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { count_label, display_order } = body;

    if (!count_label || typeof count_label !== 'string' || !count_label.trim()) {
      return NextResponse.json(
        { success: false, error: 'Count label is required (e.g. "30 Count")' },
        { status: 400 }
      );
    }

    const newCount = await createCount(count_label.trim(), display_order ? Number(display_order) : undefined);
    return NextResponse.json({
      success: true,
      message: 'Count created successfully',
      data: newCount,
    });
  } catch (error: any) {
    console.error('Error creating count:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create count' },
      { status: 500 }
    );
  }
}

