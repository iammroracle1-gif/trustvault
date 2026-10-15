// One-time database migration API
// Run this ONCE to set up multi-currency tables
// DELETE THIS FILE after migration is complete!

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminPassword } = body;

    // Security check
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    const results: string[] = [];

    // 1. Create crypto_balances table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS crypto_balances (
          id SERIAL PRIMARY KEY,
          wallet_id VARCHAR(255) NOT NULL,
          currency VARCHAR(10) NOT NULL,
          amount DECIMAL(20, 8) NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(wallet_id, currency)
        )
      `;
      results.push('✅ Created crypto_balances table');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        results.push('⚠️ crypto_balances table already exists');
      } else {
        throw error;
      }
    }

    // 2. Create indexes
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_crypto_balances_wallet ON crypto_balances(wallet_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_crypto_balances_currency ON crypto_balances(currency)`;
      results.push('✅ Created indexes on crypto_balances');
    } catch (error) {
      results.push('⚠️ Indexes may already exist');
    }

    // 3. Update transactions table
    try {
      await sql`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD'`;
      await sql`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS crypto_amount DECIMAL(20, 8)`;
      results.push('✅ Updated transactions table with crypto columns');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        results.push('⚠️ Transactions table already updated');
      } else {
        throw error;
      }
    }

    // 4. Add migration flag to users table
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS migrated_to_crypto BOOLEAN DEFAULT FALSE`;
      results.push('✅ Added migration flag to users table');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        results.push('⚠️ Migration flag already exists');
      } else {
        throw error;
      }
    }

    // 5. Migrate existing USD balances to USDT
    const migrateResult = await sql`
      INSERT INTO crypto_balances (wallet_id, currency, amount, created_at, updated_at)
      SELECT 
        wallet_id,
        'USDT' as currency,
        balance as amount,
        NOW() as created_at,
        NOW() as updated_at
      FROM users
      WHERE balance > 0 AND (migrated_to_crypto IS NULL OR migrated_to_crypto = FALSE)
      ON CONFLICT (wallet_id, currency) 
      DO UPDATE SET 
        amount = crypto_balances.amount + EXCLUDED.amount,
        updated_at = NOW()
      RETURNING wallet_id, amount
    `;

    results.push(`✅ Migrated ${migrateResult.rowCount} users to USDT`);

    // 6. Mark migrated users
    await sql`
      UPDATE users 
      SET migrated_to_crypto = TRUE 
      WHERE balance > 0 AND (migrated_to_crypto IS NULL OR migrated_to_crypto = FALSE)
    `;
    results.push('✅ Marked users as migrated');

    // 7. Verify migration
    const verifyResult = await sql`
      SELECT 
        u.wallet_id,
        u.email,
        u.balance as old_usd_balance,
        cb.currency,
        cb.amount as new_crypto_amount
      FROM users u
      LEFT JOIN crypto_balances cb ON u.wallet_id = cb.wallet_id
      WHERE u.balance > 0
      ORDER BY u.created_at DESC
      LIMIT 10
    `;

    return NextResponse.json({
      success: true,
      message: 'Database migration completed successfully!',
      results,
      migratedUsers: migrateResult.rowCount,
      sampleData: verifyResult.rows,
      warning: '⚠️ DELETE the file app/api/admin/migrate-database/route.ts after confirming migration worked!'
    });

  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
