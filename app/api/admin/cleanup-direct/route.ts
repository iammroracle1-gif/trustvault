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

// Direct SQL cleanup - deletes users with status='deleted' permanently
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

    console.log('🧹 Starting direct SQL cleanup...');

    // Step 1: Get list of users to delete
    const usersToDelete = await sql`
      SELECT wallet_id, email, status FROM users WHERE status = 'deleted'
    `;

    console.log(`📋 Found ${usersToDelete.rows.length} users with status='deleted'`);
    
    if (usersToDelete.rows.length === 0) {
      const response = NextResponse.json({
        success: true,
        message: 'No deleted users found in database',
        deletedCount: 0,
        users: []
      });
      return addCorsHeaders(response);
    }

    // Step 2: Delete each user directly
    let deletedCount = 0;
    const deletedUsers = [];

    for (const user of usersToDelete.rows) {
      try {
        await sql`DELETE FROM users WHERE wallet_id = ${user.wallet_id}`;
        deletedCount++;
        deletedUsers.push({ wallet_id: user.wallet_id, email: user.email });
        console.log(`✅ Deleted: ${user.email}`);
      } catch (err) {
        console.error(`❌ Failed to delete ${user.email}:`, err);
      }
    }

    console.log(`🎉 Cleanup complete! Deleted ${deletedCount} users`);

    const response = NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} users permanently`,
      deletedCount,
      users: deletedUsers
    });
    
    return addCorsHeaders(response);

  } catch (error: any) {
    console.error('❌ Direct cleanup failed:', error);
    const response = NextResponse.json(
      { success: false, error: error.message, details: error.toString() },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
