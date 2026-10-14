# Testing the Deposit Notification System

## 🧪 Quick Test Guide

### Prerequisites
- User account created and logged in
- Admin access (password: admin123)
- Email service configured (RESEND_API_KEY)

---

## Step-by-Step Test

### 1. Create Deposit Request (As User)

1. **Login to user account**
   ```
   Go to: /dashboard
   Make sure you're logged in
   ```

2. **Navigate to Deposit Page**
   ```
   Click "Receive" button on dashboard
   OR go directly to: /deposit
   ```

3. **Submit Deposit Request**
   - Select cryptocurrency (e.g., BTC)
   - Enter amount (e.g., $5,000)
   - Click "Submit Deposit Request"
   - Copy the QR code address (optional)
   - Note: Request is created in database as 'pending'

4. **Verify Request Created**
   - Check browser console for success message
   - Modal should show success confirmation

---

### 2. Approve Deposit (As Admin)

**Option A: Using Admin Dashboard** (Recommended)
```
1. Go to: /admin/login
2. Enter admin credentials
3. Go to: /admin/dashboard
4. Find the pending deposit request
5. Click "Approve" button
6. Enter admin password when prompted
7. Watch for success confirmation
```

**Option B: Using API Directly**
```bash
# Make POST request to approval endpoint
curl -X POST https://trust-vault.live/api/admin/deposit-requests \
  -H "Content-Type: application/json" \
  -d '{
    "requestId": "123",
    "adminPassword": "admin123"
  }'
```

**What Happens When Approved**:
- ✅ User balance increases in database
- ✅ Deposit request marked as 'approved'
- ✅ Email sent to user's registered email
- ✅ Console logs: "✅ Deposit approved..." and "✅ Deposit email sent to..."

---

### 3. Verify Email Notification

**Check User's Email Inbox**:

Expected email should look like:

```
From: Trust Vault <notifications@trust-vault.live>
Subject: ✅ Deposit Received - $5,000 BTC

[Beautiful iOS-style dark theme email]

[Green Badge: DEPOSIT CONFIRMED]

Funds Received
+$5,000

Your deposit from [Binance/Coinbase/Kraken/Crypto.com] 
has been successfully credited to your Trust Vault wallet.

┌─────────────────────────────────┐
│ From: Binance                   │
│ Cryptocurrency: BTC             │
│ Amount (USD): $5,000            │
│ Transaction ID: TX170...ABC123  │
│ Status: Completed               │
│ Time: [Current time]            │
└─────────────────────────────────┘

[View Balance Button]
```

**Verify Email Details**:
- ✅ Shows random exchange name (not "admin")
- ✅ Displays full amount
- ✅ Has realistic transaction ID
- ✅ Green success styling
- ✅ All transaction details present

---

### 4. Verify Dashboard Updates (As User)

**Automatic Updates** (no refresh needed):

**Within 30 seconds**, the dashboard should automatically update:

1. **Balance Increases**
   ```
   Before: $0.00
   After:  $5,000.00
   ```
   - Updates every 5 seconds from database
   - No page refresh needed

2. **Notification Badge Appears**
   ```
   Bell icon (top right) shows red badge: "1"
   ```

3. **Recent Activity Section**
   ```
   New entry appears:
   
   [Green Arrow Icon] Received
                      Just now
                      From: Binance
                      +$5,000 BTC
                      Completed
   ```

4. **Notifications Page**
   ```
   Go to: /notifications
   
   New notification at top:
   - [Green Icon] Deposit Received
   - "+$5,000 from Binance"
   - "Just now"
   - Unread dot/styling
   ```

---

## 📊 Expected Console Logs

### User Browser Console:
```
🔍 Fetching balance for wallet ID: abc123
💰 Balance API response: { success: true, balance: 5000 }
✅ Balance synced from database: 5000
🔔 New notifications: 1
✅ Notifications synced: { newNotifications: 1, totalNotifications: 1, unread: 1 }
```

### Server Console:
```
✅ Deposit approved: abc123 received $5000
✅ Deposit email sent to: user@example.com ID: re_abc123xyz
```

---

## 🔍 Verification Checklist

After completing the test, verify:

- [ ] Email received by user
- [ ] Email shows exchange name (not "admin")
- [ ] Balance updated on dashboard
- [ ] Notification badge shows "1"
- [ ] Recent Activity has new entry
- [ ] Notifications page has new item
- [ ] No page refresh was needed
- [ ] Transaction ID looks realistic
- [ ] All amounts match deposit amount

---

## 🐛 Troubleshooting

### Email Not Received?

1. **Check Resend Dashboard**
   - Go to: https://resend.com/dashboard
   - Check "Emails" tab
   - Look for recent send attempt
   - Check delivery status

2. **Check Environment Variable**
   ```bash
   # Verify .env.local has:
   RESEND_API_KEY=re_your_key_here
   ```

3. **Check Console Logs**
   ```
   Look for: "✅ Deposit email sent to..."
   or error: "❌ Email notification failed:"
   ```

4. **Test Email Service Directly**
   ```
   Go to: /test-email-page
   Send test email
   ```

### Dashboard Not Updating?

1. **Check Browser Console**
   - Look for polling errors
   - Verify "Fetching balance..." logs appear every 5s
   - Verify "New notifications..." logs appear when new deposits

2. **Check localStorage**
   ```javascript
   // In browser console:
   localStorage.getItem('wallet_id')
   localStorage.getItem('last_notification_check')
   localStorage.getItem('notifications')
   localStorage.getItem('recentActivity')
   ```

3. **Verify Database**
   ```sql
   -- Check if deposit was approved
   SELECT * FROM deposit_requests 
   WHERE status = 'approved' 
   ORDER BY approved_at DESC;

   -- Check user balance
   SELECT balance FROM users WHERE wallet_id = 'abc123';
   ```

### Notifications Not Appearing?

1. **Check Last Check Timestamp**
   ```javascript
   // Browser console:
   localStorage.getItem('last_notification_check')
   // Should be a timestamp like: "1700000000000"
   ```

2. **Force Immediate Check**
   ```javascript
   // Browser console:
   localStorage.setItem('last_notification_check', '0')
   // Wait 30 seconds for next poll
   ```

3. **Check API Response**
   ```
   Open Network tab
   Wait for: /api/user/pending-notifications request
   Check response: should have notifications array
   ```

---

## 🎯 Success Criteria

Test is successful when:

1. ✅ Email arrives within 10 seconds of approval
2. ✅ Dashboard balance updates within 5 seconds
3. ✅ Notification appears within 30 seconds
4. ✅ Recent Activity shows new deposit within 30 seconds
5. ✅ Notification badge increments automatically
6. ✅ Exchange name is randomized (not "admin")
7. ✅ Transaction ID looks realistic
8. ✅ No manual page refresh needed

---

## 🔄 Test Multiple Deposits

To test multiple deposit notifications:

1. Create deposit request #1 → Approve → Wait 30s
2. Create deposit request #2 → Approve → Wait 30s
3. Create deposit request #3 → Approve → Wait 30s

**Expected**:
- Badge shows: "3"
- Recent Activity has 3 entries
- Notifications page has 3 items
- Balance increases by sum of all deposits
- Each has different exchange name

---

## 📸 Screenshot Checklist

For documentation, capture:

1. Email in inbox (full email)
2. Dashboard before deposit
3. Dashboard after deposit (showing updated balance)
4. Notification badge with count
5. Recent Activity section
6. Notifications page with new item
7. Browser console logs
8. Admin approval confirmation

---

## ⏱️ Timing Summary

| Event | Time | Notes |
|-------|------|-------|
| Admin approves deposit | T+0s | Instant |
| Email sent | T+1s | Via Resend API |
| Email received | T+2-5s | Depends on email provider |
| Balance sync | T+0-5s | Next polling interval |
| Notification poll | T+0-30s | Next polling interval |
| Dashboard updates | T+0-30s | Automatic |

**No manual refresh needed at any point!**

---

**Happy Testing! 🎉**
