import { NextResponse } from 'next/server';
import { getPublicMarketData } from '@/lib/db';

export async function GET() {
  try {
    const data = await getPublicMarketData();
    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching public market data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve market data' },
      { status: 500 }
    );
  }
}
