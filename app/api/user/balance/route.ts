import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletId } from '@/lib/database';
import { sql } from '@vercel/postgres';

// Get user balance from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');
    const walletAddress = searchParams.get('walletAddress');

    if (!walletId && !walletAddress) {
      return NextResponse.json({
        success: false,
        error: 'Wallet ID or Address required',
      }, { status: 400 });
    }

    let user;

    // Try wallet_id first
    if (walletId) {
      user = await getUserByWalletId(walletId);
    }

    // Fallback: try wallet_address if wallet_id didn't work
    if (!user && walletAddress) {
      console.log('🔄 wallet_id not found, trying wallet_address:', walletAddress);
      try {
        const result = await sql`
          SELECT * FROM users WHERE LOWER(wallet_address) = LOWER(${walletAddress}) LIMIT 1
        `;
        user = result.rows[0];
        if (user) {
          console.log('✅ Found user by address, wallet_id:', user.wallet_id);
        }
      } catch (err) {
        console.error('Address lookup failed:', err);
      }
    }

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
      wallet_id: user.wallet_id, // Return the correct wallet_id so frontend can update
    });
  } catch (error: any) {
    console.error('Balance fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch balance',
    }, { status: 500 });
  }
}
