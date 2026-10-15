import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserByWalletId,
  updateUser as updateDbUser,
  addTransaction as addDbTransaction,
} from '@/lib/database';
import { 
  getUser, 
  updateUser, 
  addTransaction 
} from '@/lib/admin-database';
import { sendTransactionEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    // TODO: Verify admin authentication
    
    const body = await request.json();
    const { walletId, amount, note } = body;

    if (!walletId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid wallet ID and positive amount required' },
        { status: 400 }
      );
    }

    // Try database first
    const dbUser = await getUserByWalletId(walletId);
    
    if (dbUser) {
      // Database user - update in database
      const oldBalance = parseFloat(dbUser.balance.toString());
      const newBalance = oldBalance + amount;

      // Update user balance
      await updateDbUser(walletId, {
        balance: newBalance as any,
      });

      // Log transaction
      const transaction = await addDbTransaction({
        userId: walletId,
        type: 'admin_deposit',
        amount,
        note: note || 'Admin deposit',
        oldBalance,
        newBalance,
        adminId: 'admin',
      });

      // Also create a deposit_request entry for notification polling system
      try {
        const { sql } = await import('@vercel/postgres');
        await sql`
          INSERT INTO deposit_requests (
            wallet_id,
            email,
            crypto,
            amount,
            deposit_address,
            network,
            status,
            approved_at
          ) VALUES (
            ${walletId},
            ${dbUser.email},
            'USD',
            ${amount},
            'Admin Direct Deposit',
            'Internal',
            'approved',
            NOW()
          )
        `;
        console.log('✅ Deposit request entry created for polling system');
      } catch (dbError) {
        console.error('⚠️ Failed to create deposit_request entry:', dbError);
      }

      // Send email notification with exchange name
      const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Crypto.com'];
      const randomExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
      const transactionId = `TX${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      try {
        const { sendDepositApprovedEmail } = await import('@/lib/email-service');

        await sendDepositApprovedEmail({
          email: dbUser.email,
          amount: amount,
          crypto: 'USD', // or could be dynamic based on deposit type
          exchange: randomExchange,
          transactionId: transactionId
        });
        console.log('✅ Deposit email sent to:', dbUser.email);
      } catch (emailError) {
        console.error('❌ Email notification failed:', emailError);
      }

      return NextResponse.json({
        success: true,
        transaction,
        newBalance,
        notification: {
          id: `notif-${Date.now()}`,
          type: 'transaction',
          title: 'Deposit Received',
          message: `+$${amount.toLocaleString()} from ${randomExchange}`,
          time: 'Just now',
          read: false,
          iconName: 'ArrowDownLeft',
          color: '#34C759',
          timestamp: Date.now()
        },
        activity: {
          id: `tx-${Date.now()}`,
          type: 'Received',
          asset: 'USD',
          amount: `+$${amount.toLocaleString()}`,
          time: 'Just now',
          status: 'Completed',
          address: randomExchange
        }
      });
    }

    // Fallback to in-memory user
    const user = getUser(walletId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Store old balance
    const oldBalance = user.balance;
    const newBalance = oldBalance + amount;

    // Update user balance
    const updatedUser = updateUser(walletId, {
      balance: newBalance,
      totalTransactions: user.totalTransactions + 1,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Log transaction
    const transaction = addTransaction({
      userId: walletId,
      type: 'admin_deposit',
      amount,
      note: note || 'Admin deposit',
      oldBalance,
      newBalance,
      adminId: 'admin',
    });

    return NextResponse.json({
      success: true,
      transaction,
      newBalance: updatedUser.balance,
    });
  } catch (error) {
    console.error('Deposit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
