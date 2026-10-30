import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAdminPricesTable, updateBulkPrices, updateSinglePrice } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const prices = await getAdminPricesTable();
    return NextResponse.json({ success: true, data: prices });
  } catch (error) {
    console.error('Error fetching admin prices:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch prices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, count_id, price, updates, publication_status = 'published' } = body;

    // Single price update
    if (action === 'single' && count_id) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        return NextResponse.json(
          { success: false, error: 'Price must be a valid positive number greater than 0' },
          { status: 400 }
        );
      }

      const updated = await updateSinglePrice(
        count_id,
        numPrice,
        publication_status,
        session.name || session.email
      );

      return NextResponse.json({
        success: true,
        message: publication_status === 'published' ? 'Price published successfully' : 'Draft saved successfully',
        data: updated,
      });
    }

    // Bulk price update
    if (action === 'bulk' && Array.isArray(updates)) {
      if (updates.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No price updates provided' },
          { status: 400 }
        );
      }

      // Validate all items
      for (const item of updates) {
        const p = Number(item.new_price_per_kg);
        if (isNaN(p) || p <= 0) {
          return NextResponse.json(
            { success: false, error: `Invalid price for count ID: ${item.count_id}. Must be positive number.` },
            { status: 400 }
          );
        }
      }

      const result = await updateBulkPrices(
        updates.map((u) => ({
          count_id: u.count_id,
          new_price_per_kg: Number(u.new_price_per_kg),
        })),
        session.name || session.email,
        publication_status
      );

      return NextResponse.json({
        success: true,
        message: publication_status === 'published' 
          ? `Successfully published prices (${result.changedCount} count rates updated)`
          : `Draft saved successfully for ${result.changedCount} counts`,
        data: result,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error updating prices:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update prices' },
      { status: 500 }
    );
  }
}

