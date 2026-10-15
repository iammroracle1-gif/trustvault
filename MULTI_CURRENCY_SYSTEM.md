# Multi-Currency Wallet System Implementation

## Overview
Transform from single USD balance to multi-currency crypto wallet system like Binance.

---

## Database Schema Changes

### 1. New Table: `crypto_balances`

```sql
CREATE TABLE crypto_balances (
  id SERIAL PRIMARY KEY,
  wallet_id VARCHAR(255) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(wallet_id, currency),
  FOREIGN KEY (wallet_id) REFERENCES users(wallet_id) ON DELETE CASCADE
);

CREATE INDEX idx_crypto_balances_wallet ON crypto_balances(wallet_id);
CREATE INDEX idx_crypto_balances_currency ON crypto_balances(currency);
```

### 2. Update `transactions` Table

```sql
ALTER TABLE transactions ADD COLUMN currency VARCHAR(10) DEFAULT 'USD';
ALTER TABLE transactions ADD COLUMN crypto_amount DECIMAL(20, 8);
```

---

## Supported Currencies

```typescript
const SUPPORTED_CURRENCIES = {
  BTC: { name: 'Bitcoin', decimals: 8 },
  ETH: { name: 'Ethereum', decimals: 8 },
  BNB: { name: 'Binance Coin', decimals: 8 },
  SOL: { name: 'Solana', decimals: 8 },
  USDT: { name: 'Tether', decimals: 2 }
};
```

---

## Features to Implement

### 1. Admin Panel - Currency-Specific Funding
- Dropdown to select currency (BTC, ETH, BNB, SOL, USDT)
- Amount input in selected currency
- Real-time USD conversion display
- Transaction records currency type

### 2. User Dashboard - Multi-Currency Display
- Total balance in BTC (like image shows "0.000009 BTC")
- USD equivalent below (≈ $0.77 USD)
- Currency selector dropdown
- Individual asset list showing each crypto balance

### 3. Asset List Section
```
Accounts:
□ Bitcoin    0.000001 BTC
             ≈ $0.10 USD

□ Ethereum   0.00500 ETH
             ≈ $12.50 USD

□ Solana     2.5 SOL
             ≈ $270 USD
```

---

## API Endpoints Needed

### New Endpoints:
1. `POST /api/admin/fund-crypto` - Fund user in specific currency
2. `GET /api/user/crypto-balances` - Get all user's crypto balances
3. `GET /api/user/balance-in-currency?currency=BTC` - Get total in specific currency
4. `GET /api/crypto/prices` - Get current prices for all currencies

---

## Implementation Steps

1. ✅ Create database schema
2. ✅ Add crypto balance functions to database.ts
3. ✅ Create price API integration (CoinGecko or CoinCap)
4. ✅ Update admin fund user page
5. ✅ Update user dashboard to show crypto balances
6. ✅ Add asset list component
7. ✅ Update transaction system
8. ✅ Migrate existing USD balances

---

## Price API Integration

Using CoinCap API (free, no API key needed):
```
https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,binance-coin,solana,tether
```

Real-time price updates every 30 seconds.

---

## Migration Plan

For existing users with USD balance:
1. Keep existing `balance` field as "legacy USD balance"
2. On first login, convert to USDT in crypto_balances table
3. Display warning: "Your balance has been converted to USDT"

---

This is a MAJOR feature implementation. Should I proceed with building this?
