// API endpoint to get current cryptocurrency prices
import { NextRequest, NextResponse } from 'next/server';
import { fetchCryptoPrices } from '@/lib/crypto-prices';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const prices = await fetchCryptoPrices();
    
    return NextResponse.json({
      success: true,
      prices,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in crypto prices API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crypto prices',
      },
      { status: 500 }
    );
  }
}
