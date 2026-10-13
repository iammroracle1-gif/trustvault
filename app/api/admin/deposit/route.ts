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

      // Send email notification
      try {
        await sendTransactionEmail({
          to: dbUser.email,
          type: 'deposit',
          data: {
            amount: `$${amount.toFixed(2)}`,
            asset: 'USD',
            txId: transaction?.id || 'N/A',
          },
        });
      } catch (emailError) {
        console.log('Email notification failed (non-critical):', emailError);
      }

      return NextResponse.json({
        success: true,
        transaction,
        newBalance,
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
