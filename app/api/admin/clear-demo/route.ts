import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    // Delete demo users from database
    await sql`
      DELETE FROM transactions 
      WHERE user_id IN ('demo-wallet-1', 'demo-wallet-2')
    `;

    await sql`
      DELETE FROM users 
      WHERE wallet_id IN ('demo-wallet-1', 'demo-wallet-2')
      OR email LIKE 'demo%@trustvault.app'
    `;

    return NextResponse.json({
      success: true,
      message: 'Demo users cleared successfully',
    });
  } catch (error: any) {
    console.error('Error clearing demo users:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
