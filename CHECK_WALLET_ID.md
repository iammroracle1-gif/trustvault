# Check Wallet ID for Balance Sync

## To check if your wallet ID matches:

### 1. Open localhost:3000/dashboard in your browser

### 2. Open browser console (F12) and run:
```javascript
console.log('Wallet ID:', localStorage.getItem('wallet_id'));
console.log('Email:', localStorage.getItem('wallet_email'));
console.log('Balance:', localStorage.getItem('balance'));
```

### 3. Compare with Admin Panel:
- Go to deployed admin: https://trust-vault.live/admin/login
- Find the user you deposited to
- Check if their wallet_id matches what you saw in step 2

## If IDs Don't Match:

You need to use the SAME user account on both local and deployed:

**Option 1: Register on Local, Deposit on Local Admin**
1. Register a new user on localhost:3000
2. Note the wallet_id from console
3. Open localhost:3000/admin/login
4. Deposit to that user
5. Balance should reflect immediately

**Option 2: Use Deployed for Both**
1. Register/login on https://trust-vault.live
2. Admin deposits on https://trust-vault.live/admin
3. User sees balance on https://trust-vault.live

## Database Connection:

Both local and deployed connect to the SAME database:
- Database: Neon Postgres (neon-erin-ladder)
- Same credentials in .env.local and Vercel env vars

## Debug Balance Sync:

Open console on dashboard page and watch for:
```
🔍 Fetching balance for wallet ID: xxx
💰 Balance API response: {...}
✅ Balance synced from database: 500
```

If you see errors, check:
1. Wallet ID exists in localStorage
2. User exists in database with that wallet ID
3. Database env vars are correct
