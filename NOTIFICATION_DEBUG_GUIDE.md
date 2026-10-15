# Notification System Debug Guide

## Issue
Admin deposits are not showing up in user notifications despite code being in place.

## Notification Flow

### 1. Admin Funds User (Multi-Currency)
**File**: `app/api/admin/fund-crypto/route.ts`

```typescript
// After successful deposit:
await sql`
  INSERT INTO deposit_requests (
    wallet_id, amount, crypto, status, created_at, approved_at
  ) VALUES (
    ${walletId}, ${usdValue}, ${currency}, 'approved', NOW(), NOW()
  )
`;
```

✅ **Status**: Code is correct with fallback for missing `approved_at` column

---

### 2. Dashboard Polls for Notifications
**File**: `app/dashboard/page.tsx`

```typescript
// Runs every 30 seconds:
const fetchPendingNotifications = async () => {
  const response = await fetch(
    `/api/user/pending-notifications?walletId=${walletId}&lastCheck=${lastCheck}`
  );
  
  if (data.success && data.count > 0) {
    // Merge with existing notifications
    localStorage.setItem('notifications', JSON.stringify(mergedNotifications));
    localStorage.setItem('recentActivity', JSON.stringify(mergedActivities));
  }
  
  // Update last check
  localStorage.setItem('last_notification_check', Date.now().toString());
};
```

✅ **Status**: Polling logic is correct

---

### 3. API Fetches New Notifications
**File**: `app/api/user/pending-notifications/route.ts`

```typescript
const deposits = await sql`
  SELECT id, crypto, amount, approved_at, created_at
  FROM deposit_requests
  WHERE wallet_id = ${walletId}
    AND status = 'approved'
    AND approved_at > ${lastCheckTime.toISOString()}
  ORDER BY approved_at DESC
`;

// Creates notification for each deposit
notifications.push({
  type: 'transaction',
  title: 'Deposit Received',
  message: `${deposit.crypto}: +$${amount} from ${exchange}`,
  iconName: 'ArrowDownLeft',
  color: '#34C759'
});
```

✅ **Status**: Query looks correct

---

## Debugging Steps

### Step 1: Check Database
Run this query in Vercel Postgres:

```sql
-- Check if deposit_requests table exists
SELECT * FROM deposit_requests ORDER BY created_at DESC LIMIT 5;

-- Check if approved_at column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'deposit_requests' AND column_name = 'approved_at';

-- Check recent deposits for a specific user
SELECT * FROM deposit_requests 
WHERE wallet_id = 'YOUR_WALLET_ID' 
ORDER BY created_at DESC;
```

### Step 2: Check Browser Console
Open browser DevTools (F12) and check:

```javascript
// Check localStorage
console.log('Wallet ID:', localStorage.getItem('wallet_id'));
console.log('Last check:', localStorage.getItem('last_notification_check'));
console.log('Notifications:', JSON.parse(localStorage.getItem('notifications') || '[]'));
console.log('Recent Activity:', JSON.parse(localStorage.getItem('recentActivity') || '[]'));

// Manually test the API
const walletId = localStorage.getItem('wallet_id');
const lastCheck = localStorage.getItem('last_notification_check') || '0';
fetch(`/api/user/pending-notifications?walletId=${walletId}&lastCheck=${lastCheck}`)
  .then(r => r.json())
  .then(data => console.log('Notification API response:', data));
```

### Step 3: Test Notification Flow

1. **Fund a user** from admin panel with any cryptocurrency
2. **Check Network tab** in DevTools:
   - Look for `POST /api/admin/fund-crypto` - should return success
   - Look for `GET /api/user/pending-notifications` - should return notifications
3. **Check Console logs** for:
   - "✅ Created in-app notification for [CURRENCY] deposit"
   - "🔔 Notification check response"
   - "🎉 New notifications found"

### Step 4: Force Notification Check

Add this to browser console to force immediate check:

```javascript
// Force notification check
const walletId = localStorage.getItem('wallet_id');
fetch(`/api/user/pending-notifications?walletId=${walletId}&lastCheck=0`)
  .then(r => r.json())
  .then(data => {
    console.log('Force check result:', data);
    if (data.notifications && data.notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(data.notifications));
      localStorage.setItem('recentActivity', JSON.stringify(data.activities));
      console.log('✅ Notifications saved to localStorage');
      location.reload();
    }
  });
```

---

## Common Issues & Solutions

### Issue 1: `approved_at` column doesn't exist
**Symptoms**: Error in logs about column not found

**Solution**: Run SQL migration:
```sql
ALTER TABLE deposit_requests 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

-- Update existing approved deposits
UPDATE deposit_requests 
SET approved_at = created_at 
WHERE status = 'approved' AND approved_at IS NULL;
```

### Issue 2: Time comparison issue
**Symptoms**: Notifications exist in DB but API returns empty

**Solution**: Check if `lastCheck` timestamp is too recent:
```javascript
// Reset last check to force showing all notifications
localStorage.setItem('last_notification_check', '0');
```

### Issue 3: Wrong wallet_id
**Symptoms**: API call succeeds but returns no data

**Solution**: Verify wallet_id matches:
```javascript
console.log('localStorage wallet_id:', localStorage.getItem('wallet_id'));

// Check what's in database
fetch('/api/user/check-status?walletId=' + localStorage.getItem('wallet_id'))
  .then(r => r.json())
  .then(data => console.log('User exists:', data));
```

### Issue 4: Notifications not rendering
**Symptoms**: localStorage has notifications but UI doesn't show them

**Solution**: Check notifications page:
```javascript
// Go to /notifications page and check state
const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
console.log('Should show', notifs.length, 'notifications');
```

---

## Expected Behavior

1. Admin deposits funds → `deposit_requests` row created
2. Within 30 seconds → Dashboard polls API
3. API returns new notifications → Saved to localStorage
4. UI updates → Badge shows count
5. User clicks notifications → Full list appears

---

## Verification Queries

### Check if deposits are being recorded:
```sql
SELECT 
  dr.id,
  dr.wallet_id,
  u.email,
  dr.crypto,
  dr.amount,
  dr.status,
  dr.created_at,
  dr.approved_at
FROM deposit_requests dr
JOIN users u ON u.wallet_id = dr.wallet_id
ORDER BY dr.created_at DESC
LIMIT 10;
```

### Check crypto balances match:
```sql
SELECT 
  u.email,
  cb.currency,
  cb.amount,
  cb.last_updated
FROM users u
LEFT JOIN crypto_balances cb ON cb.wallet_id = u.wallet_id
WHERE u.email = 'test@example.com'
ORDER BY cb.currency;
```

---

## Files to Monitor

1. `app/api/admin/fund-crypto/route.ts` - Deposit endpoint
2. `app/api/user/pending-notifications/route.ts` - Notification fetcher
3. `app/dashboard/page.tsx` - Polling mechanism
4. `app/notifications/page.tsx` - Display logic

---

## Next Steps

1. ✅ Admin panel balance fix - COMPLETED
2. 🔍 Debug notification flow - USE THIS GUIDE
3. ⏳ Test asset detail page balance display
4. ⏳ Verify account navigation works

---

**Last Updated**: October 15, 2026
**Status**: Diagnostic guide created
