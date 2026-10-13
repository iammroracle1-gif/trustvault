import { NextRequest, NextResponse } from 'next/server';

// In-memory database (replace with real database like PostgreSQL, MongoDB, etc.)
const users: Map<string, any> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 });
    }

    const user = users.get(walletId);

    return NextResponse.json({
      email: user?.email || '',
      isVerified: user?.isVerified || false,
      notifications: user?.notifications || {
        deposits: true,
        withdrawals: true,
        transfers: true,
        trades: true,
        security: true,
        priceAlerts: false,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletId, email, notifications } = body;

    if (!walletId || !email) {
      return NextResponse.json({ error: 'Wallet ID and email required' }, { status: 400 });
    }

    // Store user data
    users.set(walletId, {
      walletId,
      email,
      isVerified: true,
      notifications,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Send verification email (implement with Resend or SendGrid)
    // await sendVerificationEmail(email);

    return NextResponse.json({ 
      success: true,
      message: 'Email settings saved successfully' 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
