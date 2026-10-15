import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletId, updateLastLogin } from '@/lib/database';
import { sendTransactionEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletId } = body;

    if (!walletId) {
      return NextResponse.json({
        success: false,
        error: 'Wallet ID is required',
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

    // Check if user is deleted or suspended
    if (user.status === 'deleted' || user.status === 'suspended') {
      return NextResponse.json({
        success: false,
        error: 'This account has been disabled. Please contact support.',
      }, { status: 403 });
    }

    // Update last login time
    await updateLastLogin(walletId);

    // Send login notification email
    try {
      await sendTransactionEmail({
        to: user.email,
        type: 'security',
        data: {
          title: 'New Login Detected',
          message: `A login was detected on your Trust Vault account from ${new Date().toLocaleString()}.`,
          walletAddress: user.wallet_address,
          loginTime: new Date().toISOString(),
        },
      });
    } catch (emailError) {
      console.log('Login email notification failed (non-critical):', emailError);
    }

    return NextResponse.json({
      success: true,
      data: {
        walletId: user.wallet_id,
        email: user.email,
        lastLogin: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Login tracking error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to track login',
    }, { status: 500 });
  }
}
