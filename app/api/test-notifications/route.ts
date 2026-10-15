import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Test endpoint to check deposit_requests table
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    if (!walletId) {
      return NextResponse.json(
        { success: false, error: 'Wallet ID required' },
        { status: 400 }
      );
    }

    // Get all deposit requests for this wallet
    const allDeposits = await sql`
      SELECT 
        id,
        crypto,
        amount,
        status,
        approved_at,
        created_at
      FROM deposit_requests
      WHERE wallet_id = ${walletId}
      ORDER BY created_at DESC
    `;

    // Get approved deposits
    const approvedDeposits = await sql`
      SELECT 
        id,
        crypto,
        amount,
        approved_at
      FROM deposit_requests
      WHERE wallet_id = ${walletId}
        AND status = 'approved'
      ORDER BY approved_at DESC
    `;

    return NextResponse.json({
      success: true,
      walletId,
      totalDeposits: allDeposits.rows.length,
      approvedDeposits: approvedDeposits.rows.length,
      allDeposits: allDeposits.rows,
      approvedOnly: approvedDeposits.rows,
      lastCheck: {
        localStorage: 'Check localStorage.getItem("last_notification_check")',
        currentTime: Date.now(),
        currentTimeISO: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
