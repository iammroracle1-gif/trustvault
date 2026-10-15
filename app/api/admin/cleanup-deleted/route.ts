import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}

// Permanently delete all users marked as "deleted"
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminPassword } = body;

    // Verify admin password
    if (adminPassword !== 'admin123') {
      const response = NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Get all deleted users
    const deletedUsers = await sql`
      SELECT wallet_id, email FROM users WHERE status = 'deleted'
    `;

    console.log(`🗑️ Found ${deletedUsers.rows.length} deleted users to clean up`);

    // Permanently delete each user and their related data
    for (const user of deletedUsers.rows) {
      // Delete deposit requests (if table exists)
      try {
        await sql`
          DELETE FROM deposit_requests WHERE wallet_id = ${user.wallet_id}
        `;
      } catch (e) {
        console.log('deposit_requests table does not exist, skipping...');
      }

      // Delete transactions (if table exists)
      try {
        await sql`
          DELETE FROM transactions WHERE user_id = ${user.wallet_id}
        `;
      } catch (e) {
        console.log('transactions table does not exist, skipping...');
      }

      // Delete user
      await sql`
        DELETE FROM users WHERE wallet_id = ${user.wallet_id}
      `;

      console.log(`✅ Permanently deleted user: ${user.email} (${user.wallet_id})`);
    }

    const response = NextResponse.json({
      success: true,
      message: `Successfully cleaned up ${deletedUsers.rows.length} deleted users`,
      deletedCount: deletedUsers.rows.length,
      users: deletedUsers.rows.map(u => ({ wallet_id: u.wallet_id, email: u.email }))
    });
    
    return addCorsHeaders(response);

  } catch (error: any) {
    console.error('❌ Cleanup failed:', error);
    const response = NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
