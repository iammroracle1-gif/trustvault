-- Trust Vault Database Schema
-- Run this in Vercel Postgres SQL console to create all required tables

-- 1. Users table (main user data)
CREATE TABLE IF NOT EXISTS users (
  wallet_id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  balance DECIMAL(20, 2) DEFAULT 0.00,
  withdrawal_restricted BOOLEAN DEFAULT false,
  restriction_reason TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  total_transactions INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'restricted', 'suspended', 'deleted'))
);

-- 2. Transactions table (transaction history)
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('admin_deposit', 'withdrawal', 'transfer', 'trade')),
  amount DECIMAL(20, 2) NOT NULL,
  note TEXT,
  old_balance DECIMAL(20, 2) NOT NULL,
  new_balance DECIMAL(20, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  admin_id VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(wallet_id) ON DELETE CASCADE
);

-- 3. Deposit requests table (for notifications)
CREATE TABLE IF NOT EXISTS deposit_requests (
  id SERIAL PRIMARY KEY,
  wallet_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  crypto VARCHAR(50) NOT NULL,
  amount DECIMAL(20, 2) NOT NULL,
  deposit_address TEXT,
  network VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  FOREIGN KEY (wallet_id) REFERENCES users(wallet_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deposit_wallet ON deposit_requests(wallet_id);
CREATE INDEX IF NOT EXISTS idx_deposit_status ON deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_approved ON deposit_requests(approved_at DESC);

-- Insert admin user if needed (optional)
-- INSERT INTO users (wallet_id, email, wallet_address, balance, status)
-- VALUES ('admin-wallet', 'admin@trust-vault.live', '0x0000000000000000000000000000000000000000', 0, 'active')
-- ON CONFLICT (email) DO NOTHING;
