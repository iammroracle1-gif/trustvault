import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Get pending notifications and activities for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');
    const lastCheck = searchParams.get('lastCheck'); // timestamp of last check

    console.log('📬 Notification request for wallet:', walletId);

    if (!walletId) {
      return NextResponse.json(
        { success: false, error: 'Wallet ID required' },
        { status: 400 }
      );
    }

    const lastCheckTime = lastCheck ? new Date(parseInt(lastCheck)) : new Date(0);
    console.log('📅 Last check time:', lastCheckTime.toISOString());

    const notifications = [];
    const activities = [];

    // Try to get deposits - but handle if table doesn't exist
    try {
      const deposits = await sql`
        SELECT 
          id,
          crypto,
          amount,
          approved_at,
          created_at
        FROM deposit_requests
        WHERE wallet_id = ${walletId}
          AND status = 'approved'
          AND approved_at > ${lastCheckTime.toISOString()}
        ORDER BY approved_at DESC
      `;

      console.log('💰 Found deposits:', deposits.rows.length);

      // Convert each deposit into notification and activity
      const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Crypto.com'];
      
      for (const deposit of deposits.rows) {
        const randomExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
        const timestamp = new Date(deposit.approved_at).getTime();
        const approvedDate = new Date(deposit.approved_at);

        // Create notification
        notifications.push({
          id: `notif-${deposit.id}-${timestamp}`,
          type: 'transaction',
          title: 'Deposit Received',
          message: `${deposit.crypto}: +$${parseFloat(deposit.amount).toLocaleString()} from ${randomExchange}`,
          time: formatTimeAgo(deposit.approved_at),
          read: false,
          iconName: 'ArrowDownLeft',
          color: '#34C759',
          timestamp: timestamp,
          realDate: approvedDate.toISOString()
        });

        // Create activity
        activities.push({
          id: `tx-${deposit.id}-${timestamp}`,
          type: 'Received',
          asset: deposit.crypto,
          amount: `+$${parseFloat(deposit.amount).toLocaleString()}`,
          time: formatTimeAgo(deposit.approved_at),
          status: 'Completed',
          address: randomExchange,
          timestamp: timestamp,
          realDate: approvedDate.toISOString()
        });
      }
    } catch (dbError: any) {
      console.log('⚠️ deposit_requests table does not exist or query failed:', dbError.message);
      // Continue without deposits - return empty arrays
    }

    console.log('✅ Returning', notifications.length, 'notifications');

    return NextResponse.json({
      success: true,
      notifications,
      activities,
      count: notifications.length
    });

  } catch (error: any) {
    console.error('❌ Failed to fetch pending notifications:', error);
    // Return empty arrays instead of error to avoid breaking the app
    return NextResponse.json({
      success: true,
      notifications: [],
      activities: [],
      count: 0,
      message: 'Notifications temporarily unavailable'
    });
  }
}

function formatTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
