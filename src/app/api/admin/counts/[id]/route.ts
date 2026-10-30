import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { updateCount, deleteCount } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { count_label, display_order, is_active } = body;

    const updates: any = {};
    if (count_label !== undefined) updates.count_label = count_label.trim();
    if (display_order !== undefined) updates.display_order = Number(display_order);
    if (is_active !== undefined) updates.is_active = Boolean(is_active);

    const updated = await updateCount(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Count not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Count updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating count:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update count' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteCount(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Count not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Count deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting count:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete count' },
      { status: 500 }
    );
  }
}

