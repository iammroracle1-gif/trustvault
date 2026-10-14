import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Get all deposit requests
export async function GET(request: NextRequest) {
  try {
    const result = await sql`
      SELECT 
        id,
        wallet_id,
        email,
        crypto,
        amount,
        deposit_address,
        network,
        status,
        created_at,
        approved_at
      FROM deposit_requests
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return NextResponse.json({
      success: true,
      requests: result.rows
    });

  } catch (error: any) {
    console.error('❌ Failed to fetch deposit requests:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Approve deposit request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, adminPassword } = body;

    // Verify admin password
    if (adminPassword !== 'admin123') {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Get deposit request details
    const requestData = await sql`
      SELECT wallet_id, email, amount, crypto
      FROM deposit_requests
      WHERE id = ${requestId} AND status = 'pending'
    `;

    if (requestData.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Deposit request not found or already processed' },
        { status: 404 }
      );
    }

    const { wallet_id, email, amount, crypto } = requestData.rows[0];

    // Update user balance
    await sql`
      UPDATE users
      SET balance = balance + ${amount}
      WHERE wallet_id = ${wallet_id}
    `;

    // Mark request as approved
    await sql`
      UPDATE deposit_requests
      SET status = 'approved', approved_at = NOW()
      WHERE id = ${requestId}
    `;

    console.log(`✅ Deposit approved: ${wallet_id} received $${amount}`);

    // Send email notification (using existing email service)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          type: 'deposit_approved',
          data: {
            amount,
            crypto,
            wallet_id
          }
        })
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Deposit approved and funds added'
    });

  } catch (error: any) {
    console.error('❌ Failed to approve deposit:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
