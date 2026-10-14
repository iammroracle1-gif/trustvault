import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletId, email, crypto, amount, address, network } = body;

    if (!walletId || !crypto || !amount || amount < 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid deposit request data' },
        { status: 400 }
      );
    }

    // Insert deposit request into database
    await sql`
      INSERT INTO deposit_requests (
        wallet_id, 
        email, 
        crypto, 
        amount, 
        deposit_address, 
        network, 
        status,
        created_at
      )
      VALUES (
        ${walletId},
        ${email || 'unknown'},
        ${crypto},
        ${amount},
        ${address},
        ${network},
        'pending',
        NOW()
      )
    `;

    console.log(`✅ Deposit request created: ${walletId} - ${amount} USD in ${crypto}`);

    return NextResponse.json({
      success: true,
      message: 'Deposit request submitted successfully'
    });

  } catch (error: any) {
    console.error('❌ Deposit request error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit deposit request' },
      { status: 500 }
    );
  }
}
