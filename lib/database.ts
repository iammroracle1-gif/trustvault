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
  migrated_to_crypto?: boolean;
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
  currency?: string;
  crypto_amount?: number;
}

export interface CryptoBalance {
  id: number;
  wallet_id: string;
  currency: string;
  amount: number;
  created_at: string;
  updated_at: string;
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
      console.error('❌ Database not available - missing POSTGRES_URL');
      return null;
    }

    console.log('📝 Creating user:', { walletId: data.walletId, email: data.email });

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

    console.log('✅ User created successfully:', result.rows[0]);
    return result.rows[0] as DatabaseUser;
  } catch (error: any) {
    console.error('❌ Error creating user:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint
    });
    
    // Check if it's a duplicate key error
    if (error.code === '23505') {
      console.error('🔴 DUPLICATE KEY ERROR - Email or wallet_id already exists');
    }
    
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

// Get user by email
export async function getUserByEmail(email: string): Promise<DatabaseUser | null> {
  try {
    if (!(await isDatabaseAvailable())) {
      return null;
    }

    const result = await sql`
      SELECT * FROM users 
      WHERE email = ${email}
    `;

    return result.rows[0] as DatabaseUser || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Get all users (for admin panel)
export async function getAllUsers(): Promise<DatabaseUser[]> {
  try {
    if (!(await isDatabaseAvailable())) {
      return [];
    }

    const result = await sql`
      SELECT * FROM users 
      ORDER BY created_at DESC
    `;

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

// Delete user permanently from database
export async function deleteUser(walletId: string): Promise<boolean> {
  try {
    if (!(await isDatabaseAvailable())) {
      return false;
    }

    // Delete user's deposit requests first (if table exists)
    try {
      await sql`
        DELETE FROM deposit_requests 
        WHERE wallet_id = ${walletId}
      `;
    } catch (e) {
      console.log('deposit_requests table does not exist, skipping...');
    }

    // Delete user's transactions (if table exists)
    try {
      await sql`
        DELETE FROM transactions 
        WHERE user_id = ${walletId}
      `;
    } catch (e) {
      console.log('transactions table does not exist, skipping...');
    }

    // Delete user permanently
    await sql`
      DELETE FROM users 
      WHERE wallet_id = ${walletId}
    `;

    console.log('✅ User permanently deleted:', walletId);
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


// ============================================
// CRYPTO BALANCE FUNCTIONS
// ============================================

// Get user's crypto balances
export async function getCryptoBalances(walletId: string): Promise<CryptoBalance[]> {
  try {
    if (!(await isDatabaseAvailable())) {
      return [];
    }

    const result = await sql`
      SELECT * FROM crypto_balances 
      WHERE wallet_id = ${walletId}
      ORDER BY currency ASC
    `;

    return result.rows as CryptoBalance[];
  } catch (error) {
    console.error('Error getting crypto balances:', error);
    return [];
  }
}

// Get user's balance for a specific currency
export async function getCryptoBalance(walletId: string, currency: string): Promise<number> {
  try {
    if (!(await isDatabaseAvailable())) {
      return 0;
    }

    const result = await sql`
      SELECT amount FROM crypto_balances 
      WHERE wallet_id = ${walletId} AND currency = ${currency}
    `;

    return result.rows[0]?.amount || 0;
  } catch (error) {
    console.error('Error getting crypto balance:', error);
    return 0;
  }
}

// Update or create crypto balance
export async function updateCryptoBalance(
  walletId: string,
  currency: string,
  amount: number
): Promise<CryptoBalance | null> {
  try {
    if (!(await isDatabaseAvailable())) {
      return null;
    }

    // Upsert: Update if exists, insert if doesn't
    const result = await sql`
      INSERT INTO crypto_balances (wallet_id, currency, amount, created_at, updated_at)
      VALUES (${walletId}, ${currency}, ${amount}, NOW(), NOW())
      ON CONFLICT (wallet_id, currency) 
      DO UPDATE SET 
        amount = ${amount},
        updated_at = NOW()
      RETURNING *
    `;

    return result.rows[0] as CryptoBalance;
  } catch (error) {
    console.error('Error updating crypto balance:', error);
    return null;
  }
}

// Add to crypto balance (for deposits)
export async function addToCryptoBalance(
  walletId: string,
  currency: string,
  amount: number
): Promise<CryptoBalance | null> {
  try {
    if (!(await isDatabaseAvailable())) {
      return null;
    }

    const result = await sql`
      INSERT INTO crypto_balances (wallet_id, currency, amount, created_at, updated_at)
      VALUES (${walletId}, ${currency}, ${amount}, NOW(), NOW())
      ON CONFLICT (wallet_id, currency) 
      DO UPDATE SET 
        amount = crypto_balances.amount + ${amount},
        updated_at = NOW()
      RETURNING *
    `;

    return result.rows[0] as CryptoBalance;
  } catch (error) {
    console.error('Error adding to crypto balance:', error);
    return null;
  }
}

// Subtract from crypto balance (for withdrawals)
export async function subtractFromCryptoBalance(
  walletId: string,
  currency: string,
  amount: number
): Promise<CryptoBalance | null> {
  try {
    if (!(await isDatabaseAvailable())) {
      return null;
    }

    // Check if user has enough balance
    const currentBalance = await getCryptoBalance(walletId, currency);
    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }

    const result = await sql`
      UPDATE crypto_balances 
      SET amount = amount - ${amount}, updated_at = NOW()
      WHERE wallet_id = ${walletId} AND currency = ${currency}
      RETURNING *
    `;

    return result.rows[0] as CryptoBalance;
  } catch (error) {
    console.error('Error subtracting from crypto balance:', error);
    return null;
  }
}

// Add crypto transaction
export async function addCryptoTransaction(data: {
  userId: string;
  type: string;
  currency: string;
  cryptoAmount: number;
  usdAmount: number;
  note?: string;
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
        currency,
        crypto_amount,
        note,
        old_balance,
        new_balance,
        created_at,
        admin_id
      ) VALUES (
        ${txId},
        ${data.userId},
        ${data.type},
        ${data.usdAmount},
        ${data.currency},
        ${data.cryptoAmount},
        ${data.note || ''},
        0,
        0,
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
    console.error('Error adding crypto transaction:', error);
    return null;
  }
}

// Migrate user's USD balance to USDT (one-time migration)
export async function migrateUserToMultiCurrency(walletId: string): Promise<boolean> {
  try {
    if (!(await isDatabaseAvailable())) {
      return false;
    }

    // Get user's current USD balance
    const user = await getUserByWalletId(walletId);
    if (!user || user.balance <= 0) {
      return true; // Nothing to migrate
    }

    // Convert USD to USDT (1:1)
    await addToCryptoBalance(walletId, 'USDT', user.balance);

    // Mark as migrated
    await sql`
      UPDATE users 
      SET migrated_to_crypto = TRUE
      WHERE wallet_id = ${walletId}
    `;

    console.log(`✅ Migrated ${user.email}: $${user.balance} USD → ${user.balance} USDT`);
    return true;
  } catch (error) {
    console.error('Error migrating user:', error);
    return false;
  }
}
