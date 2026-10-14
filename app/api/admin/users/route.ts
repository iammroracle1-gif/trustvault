import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllUsers as getDbUsers,
  getUserByWalletId,
  updateUser as updateDbUser,
  deleteUser as deleteDbUser,
} from '@/lib/database';
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
      // Try database first
      const dbUser = await getUserByWalletId(walletId);
      if (dbUser) {
        return NextResponse.json({
          walletId: dbUser.wallet_id,
          email: dbUser.email,
          walletAddress: dbUser.wallet_address,
          balance: parseFloat(dbUser.balance.toString()),
          withdrawalRestricted: dbUser.withdrawal_restricted,
          restrictionReason: dbUser.restriction_reason,
          createdAt: dbUser.created_at,
          lastActivity: dbUser.last_activity,
          lastLogin: dbUser.last_login,
          totalTransactions: dbUser.total_transactions,
          status: dbUser.status,
        });
      }
      
      // Fallback to in-memory
      const user = getUser(walletId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    // Get all users - ONLY from database (no in-memory fallback)
    const dbUsers = await getDbUsers();
    
    // Clear in-memory cache to prevent showing deleted users
    adminUsers.clear();
    
    // Repopulate cache with current database users
    if (dbUsers && dbUsers.length > 0) {
      dbUsers.forEach(user => {
        adminUsers.set(user.wallet_id, {
          walletId: user.wallet_id,
          email: user.email,
          balance: parseFloat(user.balance.toString()),
          withdrawalRestricted: user.withdrawal_restricted,
          restrictionReason: user.restriction_reason,
          createdAt: user.created_at,
          lastActivity: user.last_activity,
          totalTransactions: user.total_transactions,
          status: user.status,
        });
      });
      
      return NextResponse.json(dbUsers.map(user => ({
        walletId: user.wallet_id,
        email: user.email,
        walletAddress: user.wallet_address,
        balance: parseFloat(user.balance.toString()),
        withdrawalRestricted: user.withdrawal_restricted,
        restrictionReason: user.restriction_reason,
        createdAt: user.created_at,
        lastActivity: user.last_activity,
        lastLogin: user.last_login,
        totalTransactions: user.total_transactions,
        status: user.status,
      })));
    }

    // Return empty array if no users in database
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to in-memory on error
    const users = getAllUsers();
    return NextResponse.json(users);
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

    // Delete from database
    const deleted = await deleteDbUser(walletId);
    
    // Also delete from in-memory cache
    adminUsers.delete(walletId);

    if (!deleted) {
      console.log('Database delete failed, but removed from cache');
    }

    return NextResponse.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
