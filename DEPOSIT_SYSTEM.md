# Deposit System Documentation

## Overview
Complete deposit/funding system with crypto selection, QR codes, and admin approval workflow.

---

## User Flow

### 1. **Access Deposit Page**
- Dashboard → Click "Receive" button → Opens `/deposit` page
- Asset Detail Page → Click "Receive" button → Opens `/deposit` page

### 2. **Select Cryptocurrency**
User can choose from:
- **BTC** (Bitcoin) - Bitcoin Network
- **ETH** (Ethereum) - Ethereum (ERC-20)
- **USDT** (Tether USD) - Ethereum (ERC-20)
- **SOL** (Solana) - Solana Network

### 3. **Enter Deposit Amount**
- Input amount in USD
- Minimum deposit: $10 USD

### 4. **Get Deposit Address**
- QR code displayed for easy scanning
- Wallet address shown with copy button
- Network information displayed

### 5. **View Instructions**
Step-by-step guide:
1. Copy wallet address or scan QR code
2. Send crypto from external wallet
3. Enter deposit amount (USD equivalent)
4. Click "I Have Made Payment"
5. Wait for admin verification (5-30 minutes)
6. Receive email notification when approved

### 6. **Submit Payment Confirmation**
- Click green "I Have Made Payment" button
- Request sent to admin for approval
- Success screen displayed

---

## Admin Flow

### **View Pending Deposits**
API Endpoint: `GET /api/admin/deposit-requests`

Returns all deposit requests with:
- User wallet_id and email
- Crypto type and amount
- Deposit address and network
- Status (pending/approved)
- Timestamps

### **Approve Deposit**
API Endpoint: `POST /api/admin/deposit-requests`

**Request Body:**
```json
{
  "requestId": 1,
  "adminPassword": "admin123"
}
```

**Process:**
1. Verifies admin password
2. Adds amount to user balance
3. Updates request status to "approved"
4. Sends email notification to user

---

## Wallet Addresses (TO BE CONFIGURED)

### Current Placeholder Addresses:

**BTC:**
```
bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

**ETH:**
```
0x742d35Ec3B1B4E5C19e8Ba7a1A2c6fAd4Be4a2f8
```

**USDT (ERC-20):**
```
0x742d35Ec3B1B4E5C19e8Ba7a1A2c6fAd4Be4a2f8
```

**SOL:**
```
DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK
```

### ⚠️ **IMPORTANT: Update These Addresses**

Edit file: `app/deposit/page.tsx`

Lines 17-46, update the `address` field for each crypto:

```typescript
const cryptoOptions: CryptoOption[] = [
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    address: "YOUR_ACTUAL_BTC_ADDRESS_HERE", // ← Change this
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    network: "Bitcoin Network"
  },
  // ... update all others
];
```

---

## Database Schema

### `deposit_requests` Table

```sql
CREATE TABLE deposit_requests (
  id SERIAL PRIMARY KEY,
  wallet_id VARCHAR(255) REFERENCES users(wallet_id),
  email VARCHAR(255),
  crypto VARCHAR(50) NOT NULL,
  amount DECIMAL(18, 2) NOT NULL,
  deposit_address TEXT NOT NULL,
  network VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP
);
```

**Status Values:**
- `pending` - Waiting for admin approval
- `approved` - Funds added to user balance

---

## Features

### ✅ **User Features**
- Crypto selection with icons
- QR code for easy wallet scanning
- Copy wallet address button
- Detailed deposit instructions
- Important warnings about network compatibility
- Amount input validation
- Real-time feedback
- Success confirmation screen

### ✅ **Admin Features**
- View all deposit requests
- Filter by status (pending/approved)
- One-click approval
- Automatic balance update
- Email notification to users
- Transaction logging

### ✅ **Security Features**
- Admin password verification
- Network compatibility warnings
- Minimum deposit amount ($10)
- Status tracking
- Timestamp logging

---

## API Endpoints

### 1. Submit Deposit Request
**POST** `/api/user/deposit-request`

**Body:**
```json
{
  "walletId": "user_wallet_id",
  "email": "user@example.com",
  "crypto": "BTC",
  "amount": 100,
  "address": "bc1qxy2...",
  "network": "Bitcoin Network"
}
```

### 2. Get All Deposit Requests
**GET** `/api/admin/deposit-requests`

**Response:**
```json
{
  "success": true,
  "requests": [
    {
      "id": 1,
      "wallet_id": "wallet123",
      "email": "user@example.com",
      "crypto": "BTC",
      "amount": "100.00",
      "status": "pending",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### 3. Approve Deposit
**POST** `/api/admin/deposit-requests`

**Body:**
```json
{
  "requestId": 1,
  "adminPassword": "admin123"
}
```

---

## Testing

### Initialize Database:
Visit: `https://trust-vault.live/api/db/init`

This will create the `deposit_requests` table.

### Test Deposit Flow:
1. Go to dashboard
2. Click "Receive" button
3. Select a cryptocurrency
4. Enter amount (e.g., $100)
5. Copy the wallet address
6. Click "I Have Made Payment"
7. Check admin panel for pending request

---

## Email Notifications

Users receive email notifications when:
- Deposit request is submitted ✅
- Deposit is approved by admin ✅
- Funds are added to their balance ✅

---

## Customization

### Change Minimum Deposit:
File: `app/deposit/page.tsx`
Line: Search for `parseFloat(amount) < 10`

### Add More Cryptocurrencies:
File: `app/deposit/page.tsx`
Add to `cryptoOptions` array:

```typescript
{
  id: "bnb",
  symbol: "BNB",
  name: "BNB",
  address: "YOUR_BNB_ADDRESS",
  icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  network: "BNB Smart Chain"
}
```

---

## Next Steps

1. **Update wallet addresses** in `app/deposit/page.tsx`
2. **Initialize database** by visiting `/api/db/init`
3. **Test the flow** with a real user account
4. **Monitor admin panel** for deposit requests
5. **Configure email templates** for deposit notifications

---

## Support

For questions or issues, check the API responses for detailed error messages.

All deposit requests are logged in the database for audit purposes.
