import { NextRequest, NextResponse } from 'next/server';

// This would connect to your database
const adminUsers: Map<string, any> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 });
    }

    const user = adminUsers.get(walletId);

    if (!user) {
      return NextResponse.json({
        withdrawalRestricted: false,
        restrictionReason: '',
        status: 'active',
      });
    }

    return NextResponse.json({
      withdrawalRestricted: user.withdrawalRestricted || false,
      restrictionReason: user.restrictionReason || '',
      status: user.status || 'active',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
