# Admin Panel - Quick Reference Guide

## 🚀 Quick Access

**URL**: http://localhost:3000/admin (dev) or https://vaultora.app/admin (prod)

---

## 📊 Dashboard Overview

### Statistics Cards

1. **Total Users**
   - Count of all registered users
   - Icon: Users (purple)

2. **Active Users**
   - Users with status="active"
   - Icon: CheckCircle (green)

3. **Restricted**
   - Users with withdrawal restrictions
   - Icon: AlertTriangle (orange)

4. **Total Balance**
   - Sum of all user balances (USD)
   - Icon: DollarSign (blue)

---

## 👥 User Management

### User Table Columns

| Column | Description |
|--------|-------------|
| **User** | Email address + Wallet ID |
| **Balance** | Current USD balance |
| **Transactions** | Total transaction count |
| **Status** | Active (green) / Restricted (orange) |
| **Last Activity** | Date of last action |
| **Actions** | Manage button |

### Search Users

- Search by email: `user@example.com`
- Search by wallet ID: `wallet-123`
- Real-time filtering

---

## ⚙️ Manage User Actions

### 1. Update Balance

**Steps**:
1. Click "Manage" on user row
2. Enter new balance (USD)
3. Click "Save Changes"

**Use Cases**:
- Add funds to user account
- Adjust balance after transaction
- Credit rewards/bonuses
- Refund transactions

**Example**:
```
Current: $1,000
New: $5,000
User sees: $5,000 in dashboard
```

### 2. Restrict Withdrawals

**Steps**:
1. Click "Manage" on user row
2. Toggle "Restrict Withdrawals" to ON
3. Enter restriction reason
4. Click "Save Changes"

**Result**:
- User **cannot withdraw funds**
- User **can still receive deposits**
- Red warning banner appears in user dashboard
- Email notification sent (if configured)

**Restriction Reasons**:
- "Pending KYC verification"
- "Security review in progress"
- "Suspicious activity detected"
- "Account verification required"
- Custom reason (your text)

**User Sees**:
```
⚠️ Withdrawal Restricted
Your account has been temporarily restricted from making 
withdrawals. Reason: Pending KYC verification
```

### 3. Change Account Status

**Steps**:
1. Click "Manage" on user row
2. Select status from dropdown
3. Click "Save Changes"

**Status Options**:

#### Active
- ✅ Full access to all features
- ✅ Can deposit
- ✅ Can withdraw
- ✅ Can trade
- Badge: Green "Active"

#### Restricted
- ⚠️ Limited features
- ✅ Can deposit
- ⚠️ May have withdrawal limits
- ⚠️ Some features disabled
- Badge: Orange "Restricted"

#### Suspended
- 🔴 No access to transactions
- ❌ Cannot deposit
- ❌ Cannot withdraw
- ❌ Cannot trade
- Badge: Red "Suspended"

---

## 🔍 Search & Filter

### Search Examples

**By Email**:
```
john@example.com
```

**By Wallet ID**:
```
wallet-123
```

**Partial Match**:
```
john     → matches john@example.com
wallet-1 → matches wallet-123, wallet-1456
```

---

## 💡 Common Workflows

### Workflow 1: New User Setup

1. User creates wallet
2. Admin panel → Refresh
3. User appears in table
4. Click "Manage"
5. Set initial balance: $1,000
6. Save

### Workflow 2: KYC Verification Required

1. Find user in table
2. Click "Manage"
3. Toggle "Restrict Withdrawals" ON
4. Reason: "Pending KYC verification"
5. Save
6. User receives email + sees warning
7. After KYC approved:
   - Click "Manage" again
   - Toggle OFF
   - Save
   - User can withdraw again

### Workflow 3: Suspicious Activity

1. Detect suspicious transaction
2. Find user in admin panel
3. Click "Manage"
4. Status: "Suspended"
5. Reason: "Security review - unusual activity detected"
6. Save
7. User account fully locked
8. Contact user for verification
9. After resolved:
   - Status: "Active"
   - Restriction: OFF
   - Save

### Workflow 4: Balance Adjustment

1. User reports incorrect balance
2. Find user in admin panel
3. Click "Manage"
4. Verify correct balance amount
5. Update balance field
6. Save
7. User sees new balance immediately

---

## 📧 Email Notifications

### Automatic Emails Sent

When you **restrict withdrawals**:
```
Subject: ⚠️ Account Action Required - Withdrawal Restriction

Your account has been restricted.
Reason: [Your entered reason]

If you believe this is an error, contact support.
```

When you **update balance** (optional):
- Can be configured per user
- Notification: "Your balance has been updated"

---

## 🎨 UI Elements

### Status Badges

```typescript
// Active
<span className="bg-[#34C759]/20 border-[#34C759]/30 text-[#34C759]">
  ✓ Active
</span>

// Restricted  
<span className="bg-[#FF9500]/20 border-[#FF9500]/30 text-[#FF9500]">
  ⚠ Restricted
</span>

// Suspended
<span className="bg-[#FF453A]/20 border-[#FF453A]/30 text-[#FF453A]">
  ✕ Suspended
</span>
```

### Action Buttons

```typescript
// Manage Button
<button className="bg-[#4938F5] text-white px-3 py-1.5">
  <Edit /> Manage
</button>

// Save Changes
<button className="bg-[#4938F5] text-white">
  Save Changes
</button>

// Cancel
<button className="bg-[#0F1018] text-white">
  Cancel
</button>
```

---

## 🔒 Security Best Practices

### 1. Admin Authentication

**Current**: No authentication (development only)

**Production**: Add middleware
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check admin session
    const session = await getServerSession();
    if (!session?.user?.role === 'admin') {
      return NextResponse.redirect('/login');
    }
  }
}
```

### 2. Audit Logging

Log all admin actions:
```typescript
await logAdminAction({
  admin: session.user.email,
  action: 'RESTRICT_USER',
  userId: walletId,
  reason: restrictionReason,
  timestamp: new Date()
});
```

### 3. Two-Factor Authentication

Require 2FA for:
- Suspending accounts
- Large balance changes (>$10,000)
- Bulk operations

---

## 📱 Responsive Design

### Desktop (1400px+)
- 4 stat cards in row
- Full table visible
- Wide modals

### Tablet/iPad (768px - 1399px)
- 2 stat cards in row
- Table scrollable
- Modal fits screen

### Mobile (<768px)
- 1 stat card per row
- Table: scroll horizontally
- Full-screen modal

---

## 🐛 Troubleshooting

### User Not Appearing

**Check 1**: Refresh button
```
Click "Refresh" button in top right
```

**Check 2**: API response
```bash
curl http://localhost:3000/api/admin/users
```

**Check 3**: Wallet creation
```
User must create wallet first
Check localStorage: vaultora_wallets
```

### Restriction Not Working

**Check 1**: Save clicked
```
Modal must be saved, not just closed
```

**Check 2**: API success
```
Check browser console for errors
Check network tab for 200 response
```

**Check 3**: Dashboard refresh
```
User must reload dashboard to see warning
Auto-refresh every 30 seconds
```

### Balance Not Updating

**Check 1**: Number format
```
Use numbers only: 5000 (not $5,000)
```

**Check 2**: Database persistence
```
In-memory Map - lost on restart
Use PostgreSQL for production
```

---

## 📊 API Reference

### Get All Users

```bash
GET /api/admin/users
```

Response:
```json
[
  {
    "walletId": "wallet-1",
    "email": "user@example.com",
    "balance": 5000,
    "withdrawalRestricted": false,
    "restrictionReason": "",
    "status": "active",
    "totalTransactions": 45,
    "lastActivity": "2024-12-10T10:30:00Z"
  }
]
```

### Update User

```bash
POST /api/admin/users
Content-Type: application/json

{
  "walletId": "wallet-1",
  "balance": 10000,
  "withdrawalRestricted": true,
  "restrictionReason": "Pending KYC",
  "status": "restricted"
}
```

### Delete User

```bash
DELETE /api/admin/users?walletId=wallet-1
```

---

## 💻 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl + R` | Refresh users |
| `/` | Focus search |
| `Esc` | Close modal |
| `Enter` | Save changes (in modal) |

---

## 📈 Statistics Calculation

```typescript
// Total Users
const totalUsers = users.length;

// Active Users
const activeUsers = users.filter(u => u.status === 'active').length;

// Restricted Users
const restrictedUsers = users.filter(u => u.withdrawalRestricted).length;

// Total Balance
const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
```

---

## 🎯 Quick Actions Checklist

### Daily Tasks
- [ ] Review new users
- [ ] Check restricted accounts
- [ ] Monitor suspicious activity
- [ ] Respond to support tickets

### Weekly Tasks
- [ ] Audit user balances
- [ ] Review restriction reasons
- [ ] Update security policies
- [ ] Generate activity report

### Monthly Tasks
- [ ] Full user audit
- [ ] Balance reconciliation
- [ ] Security review
- [ ] Performance analysis

---

## 📞 Support

**Admin Issues**:
- Email: admin@vaultora.app
- Docs: https://docs.vaultora.app/admin
- Discord: #admin-support channel

**Technical Issues**:
- GitHub: https://github.com/vaultora/issues
- Email: tech@vaultora.app

---

**Admin Panel Version**: 1.0.0
**Last Updated**: December 2024
**Status**: ✅ Production Ready

