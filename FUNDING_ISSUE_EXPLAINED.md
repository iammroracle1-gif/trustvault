# Why Funded Balance Doesn't Show Up

## The Problem

When you fund a user from admin panel, the balance updates in database, but the user doesn't see it.

## Root Cause

**wallet_id mismatch** between localStorage and database.

### What Happens:

1. **User imports wallet** (without registering email)
   ```
   wallet_id = "wallet-1792057422185-4kteo9tvp"
   Saved to: localStorage
   NOT in database (never registered)
   ```

2. **Admin tries to fund user**
   - Problem: User doesn't exist in admin panel (not registered)
   - Can't select user to fund

3. **If user IS in database** (registered separately):
   ```
   Database wallet_id = "wallet-1792046710390-k8e8bf1xg"
   localStorage wallet_id = "wallet-1792057422185-4kteo9tvp"
   
   MISMATCH! ❌
   ```

4. **Dashboard fetches balance**:
   ```javascript
   // Uses wallet_id from localStorage
   fetch(`/api/user/balance?walletId=${localStorage.getItem('wallet_id')}`)
   
   // Looks up: wallet-1792057422185-4kteo9tvp
   // Database has: wallet-1792046710390-k8e8bf1xg
   
   // Result: User not found, balance = 0
   ```

## The Flow Issue

### Correct Flow:
```
User → Import Wallet → Register Email → Gets wallet_id → Shows in Admin → Fund → Balance shows ✅
```

### What's Happening:
```
User → Import Wallet → (No email registration) → Not in admin panel ❌
OR
User → Import Wallet → Register on different device → Different wallet_ids ❌
```

## Solutions

### Solution 1: Force Email Registration (Recommended)

After importing wallet, redirect to email registration:

```
Import Wallet → Email Registration (Required) → Dashboard
```

This ensures:
- User exists in database
- wallet_id is consistent
- Admin can see and fund user
- Balance updates properly

### Solution 2: Fund by wallet_id

Create admin tool to fund by wallet_id directly (not just email selection).

User visits `/my-wallet-id` to get their wallet_id, sends to admin, admin funds using that ID.

### Solution 3: Link by Address

Instead of wallet_id, use wallet_address for lookups. Same seed phrase = same address.

## Immediate Fix

### For Users:

1. Visit `/my-wallet-id` to get your wallet ID
2. Send wallet ID to admin
3. Admin uses that exact ID to fund you

### For Admin:

When funding, use the exact wallet_id the user provides, not the one from admin panel list.

## Long-term Fix

### Require Email Registration

Modify `import-wallet` page to redirect to `/register-email` after import:

```typescript
// After successful wallet import
router.push('/register-email?address=' + wallet.address);
```

This ensures:
- All users in database
- Consistent wallet_ids
- Admin can see all users
- Funding works correctly

## Check Your Situation

### Is user registered?

```sql
SELECT * FROM users WHERE email = 'user@email.com';
```

If no rows: **User never registered** → Can't fund from admin panel

### Check wallet_id:

**In browser console:**
```javascript
console.log(localStorage.getItem('wallet_id'));
```

**In database:**
```sql
SELECT wallet_id FROM users WHERE email = 'user@email.com';
```

If they don't match: **That's the problem!**

## Testing

1. Import wallet → See wallet_id: `wallet-ABC123`
2. Register email → Check database: should have same `wallet-ABC123`
3. Admin funds user with `wallet-ABC123`
4. User's dashboard fetches balance with `wallet-ABC123`
5. Balance updates! ✅

## Files to Check

- `app/import-wallet/page.tsx` - Generates wallet_id
- `app/register-email/page.tsx` - Saves to database
- `app/dashboard/page.tsx` - Fetches balance
- `app/api/user/balance/route.ts` - Returns balance
- `app/api/admin/deposit/route.ts` - Updates balance

## Quick Debug

Visit: `/my-wallet-id` to see your current wallet_id

Compare with database:
```sql
SELECT wallet_id, email FROM users;
```

If mismatch found, that's why balance doesn't show!
