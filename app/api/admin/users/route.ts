import { NextRequest, NextResponse } from 'next/server';
import { 
  adminUsers, 
  getUser, 
  getAllUsers, 
  updateUser, 
  type User 
} from '@/lib/admin-database';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    if (walletId) {
      const user = getUser(walletId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    // Return all users
    const users = getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const body = await request.json();
    const { walletId, balance, withdrawalRestricted, restrictionReason, status } = body;

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 });
    }

    let user = getUser(walletId);
    
    if (!user) {
      // Create new user
      user = {
        walletId,
        email: body.email || '',
        balance: balance || 0,
        withdrawalRestricted: withdrawalRestricted || false,
        restrictionReason: restrictionReason || '',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        totalTransactions: 0,
        status: status || 'active',
      };
      adminUsers.set(walletId, user);
    } else {
      // Update existing user
      const updates: Partial<User> = {};
      if (balance !== undefined) updates.balance = balance;
      if (withdrawalRestricted !== undefined) updates.withdrawalRestricted = withdrawalRestricted;
      if (restrictionReason !== undefined) updates.restrictionReason = restrictionReason;
      if (status !== undefined) updates.status = status;
      
      user = updateUser(walletId, updates)!;
    }

    // Send notification email if withdrawal restriction changed
    if (withdrawalRestricted !== undefined && user.email) {
      // TODO: Send email notification
      console.log(`Sending restriction notification to ${user.email}`);
    }

    return NextResponse.json({ 
      success: true, 
      user 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 });
    }

    adminUsers.delete(walletId);

    return NextResponse.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
