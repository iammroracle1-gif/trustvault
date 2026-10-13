import { NextRequest, NextResponse } from 'next/server';
import { 
  getUser, 
  updateUser, 
  addTransaction 
} from '@/lib/admin-database';

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

    // Get user
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
      adminId: 'admin', // TODO: Get from session
    });

    console.log('Deposit successful:', transaction);

    // Send email notification if user has email configured
    if (user.email) {
      // TODO: Send deposit notification email
      console.log(`Sending deposit email to ${user.email}`);
    }

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
