import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletId } from '@/lib/database';

// Check if user account is still active
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    console.log('🔍 Status check requested for wallet_id:', walletId);

    if (!walletId) {
      console.log('❌ No wallet_id provided');
      return NextResponse.json({
        success: false,
        error: 'Wallet ID required',
      }, { status: 400 });
    }

    // Get user from database
    let user;
    try {
      user = await getUserByWalletId(walletId);
      console.log('📊 Database lookup result:', user ? `Found user: ${user.email}` : 'User not found');
    } catch (dbError: any) {
      console.error('❌ Database error:', dbError.message);
      // If database fails, don't block user - return unregistered
      return NextResponse.json({
        success: true,
        accountDeleted: false,
        status: 'unregistered',
        message: 'Database temporarily unavailable - allowing access',
      });
    }

    if (!user) {
      // User not registered in database - this is OK
      console.log('✅ User not in database - status: unregistered (OK)');
      return NextResponse.json({
        success: true,
        accountDeleted: false,
        status: 'unregistered',
        message: 'User not registered in database yet',
      });
    }

    // Check if user is deleted or suspended
    if (user.status === 'deleted' || user.status === 'suspended') {
      console.log('❌ User status:', user.status, '- will trigger logout');
      return NextResponse.json({
        success: false,
        accountDeleted: true,
        status: user.status,
        error: 'Your account has been disabled by an administrator.',
      }, { status: 403 });
    }

    console.log('✅ User status:', user.status, '- all good');
    return NextResponse.json({
      success: true,
      accountDeleted: false,
      status: user.status,
    });
  } catch (error: any) {
    console.error('❌ Status check error:', error);
    // On error, allow access to avoid blocking users
    return NextResponse.json({
      success: true,
      accountDeleted: false,
      status: 'unregistered',
      message: 'Status check failed - allowing access',
      error: error.message,
    });
  }
}
