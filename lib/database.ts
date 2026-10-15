// Vercel Postgres Database Integration
// Production-ready user management with email notifications

import { sql } from '@vercel/postgres';

export interface DatabaseUser {
  wallet_id: string;
  email: string;
  wallet_address: string;
  balance: number;
  withdrawal_restricted: boolean;
  restriction_reason: string;
  created_at: string;
  last_activity: string;
  total_transactions: number;
  status: 'active' | 'restricted' | 'suspended' | 'deleted';
  last_login?: string;
}

export interface DatabaseTransaction {
  id: string;
  user_id: string;
  type: 'admin_deposit' | 'withdrawal' | 'transfer' | 'trade';
  amount: number;
  note?: string;
  old_balance: number;
  new_balance: number;
  created_at: string;
  admin_id?: string;
}

// Check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    // Check for any Postgres environment variable
    if (!process.env.POSTGRES_URL && 
        !process.env.POSTGRES_PRISMA_URL && 
        !process.env.POSTGRES_URL_NON_POOLING) {
      console.log('Database not configured - using in-memory storage');
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

// Create a new user in the database
export async function createUser(data: {
  walletId: string;
  email: string;
  walletAddress: string;
}): Promise<DatabaseUser | null> {
  try {
    if (!(await isDatabaseAvailable())) {
      console.log('Database not available');
      return null;
    }

    const result = await sql`
      INSERT INTO users (
        wallet_id, 
        email, 
        wallet_address, 
        balance, 
        withdrawal_restricted,
        restriction_reason,
        created_at,
        last_activity,
        total_transactions,
        status
      ) VALUES (
        ${data.walletId},
        ${data.email},
        ${data.walletAddress},
        0.00,
        false,
        '',
        NOW(),
        NOW(),
        0,
        'active'
      )
      RETURNING *
    `;

    return result.rows[0] as DatabaseUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Get user by wallet ID
export async function getUserByWalletId(walletId: string): Promise<DatabaseUser | null> {
  try {
    if (!(await isDatabaseAvailable())) {
      return null;
    }

    const result = await sql`
      SELECT * FROM users WHERE wallet_id = ${walletId}
    `;

    return result.rows[0] as DatabaseUser || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Get user by email (exclude deleted users)
export async function getUserByEmail(email: string): Promise<DatabaseUser | null> {
  try {
    if (!(await isDatabaseAvailable())) {
      return null;
    }

    const result = await sql`
      SELECT * FROM users 
      WHERE email = ${email} 
        AND status != 'deleted'
    `;

    return result.rows[0] as DatabaseUser || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Get all users (for admin panel) - excludes deleted users by default
export async function getAllUsers(includeDeleted: boolean = false): Promise<DatabaseUser[]> {
  try {
    if (!(await isDatabaseAvailable())) {
      return [];
    }

    const result = includeDeleted 
      ? await sql`SELECT * FROM users ORDER BY created_at DESC`
      : await sql`SELECT * FROM users WHERE status != 'deleted' ORDER BY created_at DESC`;

    return result.rows as DatabaseUser[];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// Update user
export async function updateUser(
  walletId: string,
  updates: Partial<DatabaseUser>
): Promise<DatabaseUser | null> {
  try {
    if (!(await isDatabaseAvailable())) {
      return null;
    }

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [walletId, ...Object.values(updates)];

    const result = await sql.query(`
      UPDATE users 
      SET ${setClause}, last_activity = NOW()
      WHERE wallet_id = $1
      RETURNING *
    `, values);

    return result.rows[0] as DatabaseUser || null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Update user's last login time
export async function updateLastLogin(walletId: string): Promise<void> {
  try {
    if (!(await isDatabaseAvailable())) {
      return;
    }

    await sql`
      UPDATE users 
      SET last_login = NOW(), last_activity = NOW()
      WHERE wallet_id = ${walletId}
    `;
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}

// Delete user (mark as deleted, don't permanently remove)
export async function deleteUser(walletId: string): Promise<boolean> {
  try {
    if (!(await isDatabaseAvailable())) {
      return false;
    }

    // Mark user as deleted instead of permanently removing
    // This prevents deleted users from logging in via passphrase
    await sql`
      UPDATE users 
      SET status = 'deleted',
          last_activity = NOW()
      WHERE wallet_id = ${walletId}
    `;

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// Add transaction
export async function addTransaction(data: {
  userId: string;
  type: string;
  amount: number;
  note?: string;
  oldBalance: number;
  newBalance: number;
  adminId?: string;
}): Promise<DatabaseTransaction | null> {
  try {
    if (!(await isDatabaseAvailable())) {
      return null;
    }

    const txId = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const result = await sql`
      INSERT INTO transactions (
        id,
        user_id,
        type,
        amount,
        note,
        old_balance,
        new_balance,
        created_at,
        admin_id
      ) VALUES (
        ${txId},
        ${data.userId},
        ${data.type},
        ${data.amount},
        ${data.note || ''},
        ${data.oldBalance},
        ${data.newBalance},
        NOW(),
        ${data.adminId || ''}
      )
      RETURNING *
    `;

    // Update user's transaction count
    await sql`
      UPDATE users 
      SET total_transactions = total_transactions + 1,
          last_activity = NOW()
      WHERE wallet_id = ${data.userId}
    `;

    return result.rows[0] as DatabaseTransaction;
  } catch (error) {
    console.error('Error adding transaction:', error);
    return null;
  }
}

// Get user transactions
export async function getUserTransactions(walletId: string): Promise<DatabaseTransaction[]> {
  try {
    if (!(await isDatabaseAvailable())) {
      return [];
    }

    const result = await sql`
      SELECT * FROM transactions 
      WHERE user_id = ${walletId}
      ORDER BY created_at DESC
    `;

    return result.rows as DatabaseTransaction[];
  } catch (error) {
    console.error('Error getting user transactions:', error);
    return [];
  }
}

// Get all transactions (for admin)
export async function getAllTransactions(): Promise<DatabaseTransaction[]> {
  try {
    if (!(await isDatabaseAvailable())) {
      return [];
    }

    const result = await sql`
      SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100
    `;

    return result.rows as DatabaseTransaction[];
  } catch (error) {
    console.error('Error getting all transactions:', error);
    return [];
  }
}
