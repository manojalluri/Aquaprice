import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAllAnnouncements, createAnnouncement } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const announcements = await getAllAnnouncements();
    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, is_published = true } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const newAnn = await createAnnouncement(
      title.trim(),
      (description || '').trim(),
      Boolean(is_published),
      session.name || session.email
    );

    return NextResponse.json({
      success: true,
      message: 'Announcement created successfully',
      data: newAnn,
    });
  } catch (error: any) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

