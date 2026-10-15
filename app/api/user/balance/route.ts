import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletId } from '@/lib/database';

// Get user balance from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    if (!walletId) {
      return NextResponse.json({
        success: false,
        error: 'Wallet ID required',
      }, { status: 400 });
    }

    // Get user from database
    const user = await getUserByWalletId(walletId);

    if (!user) {
      // User not registered - return 0 balance
      return NextResponse.json({
        success: true,
        balance: 0,
        currency: 'USD',
        status: 'unregistered',
        message: 'User not registered yet. Balance will be available after email registration.',
      });
    }

    return NextResponse.json({
      success: true,
      balance: user.balance || 0,
      currency: 'USD',
      status: user.status,
      withdrawalRestricted: user.withdrawal_restricted || false,
    });
  } catch (error: any) {
    console.error('Balance fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch balance',
    }, { status: 500 });
  }
}
