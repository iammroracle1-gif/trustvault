import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletId } from '@/lib/database';

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
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      balance: parseFloat(user.balance.toString()),
      walletAddress: user.wallet_address,
      email: user.email,
    });
  } catch (error: any) {
    console.error('Balance fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch balance',
    }, { status: 500 });
  }
}
