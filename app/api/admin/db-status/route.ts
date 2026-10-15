import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Check database status and user counts
export async function GET() {
  try {
    // Get all users with their status
    const users = await sql`
      SELECT 
        wallet_id, 
        email, 
        status, 
        balance,
        created_at 
      FROM users 
      ORDER BY created_at DESC
    `;

    // Count by status
    const statusCounts = {
      active: 0,
      deleted: 0,
      restricted: 0,
      suspended: 0,
      total: users.rows.length
    };

    users.rows.forEach((user: any) => {
      statusCounts[user.status as keyof typeof statusCounts]++;
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: 'connected',
      counts: statusCounts,
      users: users.rows.map((u: any) => ({
        wallet_id: u.wallet_id,
        email: u.email,
        status: u.status,
        balance: u.balance,
        created_at: u.created_at
      }))
    });

  } catch (error: any) {
    console.error('Database status check failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
