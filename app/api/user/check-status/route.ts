import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletId } from '@/lib/database';

// Check if user account is still active
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
        accountDeleted: true,
        error: 'Account not found',
      }, { status: 404 });
    }

    // Check if user is deleted or suspended
    if (user.status === 'deleted' || user.status === 'suspended') {
      return NextResponse.json({
        success: false,
        accountDeleted: true,
        status: user.status,
        error: 'Your account has been disabled by an administrator.',
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      accountDeleted: false,
      status: user.status,
    });
  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check account status',
    }, { status: 500 });
  }
}
