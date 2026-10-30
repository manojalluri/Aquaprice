import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getSettings, updateSettings } from '@/lib/db';

// Simple Indian phone validator: accepts 10 digits or with optional leading +91 / 0
function cleanIndianPhone(phone: string): { valid: boolean; cleaned: string } {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return { valid: true, cleaned: digits };
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return { valid: true, cleaned: digits.substring(2) };
  } else if (digits.length === 11 && digits.startsWith('0')) {
    return { valid: true, cleaned: digits.substring(1) };
  }
  return { valid: false, cleaned: digits };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      buyer_name,
      buyer_phone,
      whatsapp_number,
      alternate_phone,
      business_name,
      contact_message,
    } = body;

    if (!buyer_name || !buyer_name.trim()) {
      return NextResponse.json({ success: false, error: 'Buyer name is required' }, { status: 400 });
    }

    if (!buyer_phone || !buyer_phone.trim()) {
      return NextResponse.json({ success: false, error: 'Primary mobile number is required' }, { status: 400 });
    }

    const phoneCheck = cleanIndianPhone(buyer_phone);
    if (!phoneCheck.valid) {
      return NextResponse.json(
        { success: false, error: 'Primary mobile number must be a valid 10-digit Indian phone number' },
        { status: 400 }
      );
    }

    if (!whatsapp_number || !whatsapp_number.trim()) {
      return NextResponse.json({ success: false, error: 'WhatsApp number is required' }, { status: 400 });
    }

    const waCheck = cleanIndianPhone(whatsapp_number);
    if (!waCheck.valid) {
      return NextResponse.json(
        { success: false, error: 'WhatsApp number must be a valid 10-digit Indian phone number' },
        { status: 400 }
      );
    }

    const updated = await updateSettings(
      {
        buyer_name: buyer_name.trim(),
        buyer_phone: phoneCheck.cleaned,
        whatsapp_number: waCheck.cleaned,
        alternate_phone: alternate_phone ? alternate_phone.trim() : '',
        business_name: (business_name || '').trim(),
        contact_message: (contact_message || '').trim(),
      },
      session.name || session.email
    );

    return NextResponse.json({
      success: true,
      message: 'Website contact settings updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}

