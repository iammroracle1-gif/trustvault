import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    if (!walletId) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    // Check if user exists in database
    const result = await sql`
      SELECT wallet_id, status
      FROM users
      WHERE wallet_id = ${walletId}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ exists: false, deleted: true }, { status: 200 });
    }

    const user = result.rows[0];
    
    return NextResponse.json({
      exists: true,
      deleted: false,
      status: user.status,
    });

  } catch (error: any) {
    console.error('❌ User status check error:', error);
    return NextResponse.json(
      { exists: false, error: error.message },
      { status: 500 }
    );
  }
}
