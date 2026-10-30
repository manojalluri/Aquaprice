import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { reorderCounts } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { success: false, error: 'orderedIds array is required' },
        { status: 400 }
      );
    }

    await reorderCounts(orderedIds);
    return NextResponse.json({
      success: true,
      message: 'Counts reordered successfully',
    });
  } catch (error: any) {
    console.error('Error reordering counts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reorder counts' },
      { status: 500 }
    );
  }
}

