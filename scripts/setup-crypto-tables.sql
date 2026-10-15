-- Multi-Currency Wallet System Database Setup
-- Run this in Vercel Postgres SQL Editor

-- 1. Create crypto_balances table
CREATE TABLE IF NOT EXISTS crypto_balances (
  id SERIAL PRIMARY KEY,
  wallet_id VARCHAR(255) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(wallet_id, currency)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_crypto_balances_wallet ON crypto_balances(wallet_id);
CREATE INDEX IF NOT EXISTS idx_crypto_balances_currency ON crypto_balances(currency);

-- 2. Update transactions table to support crypto
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS crypto_amount DECIMAL(20, 8);

-- 3. Migrate existing USD balances to USDT
-- This converts all existing user balances to USDT in crypto_balances table
INSERT INTO crypto_balances (wallet_id, currency, amount, created_at, updated_at)
SELECT 
  wallet_id,
  'USDT' as currency,
  balance as amount,
  NOW() as created_at,
  NOW() as updated_at
FROM users
WHERE balance > 0
ON CONFLICT (wallet_id, currency) 
DO UPDATE SET 
  amount = crypto_balances.amount + EXCLUDED.amount,
  updated_at = NOW();

-- 4. Add migration flag to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS migrated_to_crypto BOOLEAN DEFAULT FALSE;

-- Mark migrated users
UPDATE users SET migrated_to_crypto = TRUE WHERE balance > 0;

-- Verify migration
SELECT 
  u.wallet_id,
  u.email,
  u.balance as old_usd_balance,
  cb.currency,
  cb.amount as new_crypto_amount
FROM users u
LEFT JOIN crypto_balances cb ON u.wallet_id = cb.wallet_id
WHERE u.balance > 0
ORDER BY u.created_at DESC;
