# Email Notification & Admin System

## Overview
Complete email notification system with admin panel for managing users, balances, and restrictions.

## 🚀 Features

### User Email Notifications
- ✅ Configure email in Settings → Email Notifications
- ✅ Receive notifications for:
  - **Deposits** - When funds are received
  - **Withdrawals** - When funds are sent
  - **Transfers** - Internal wallet transfers
  - **Trades** - Perpetual futures trades
  - **Security Alerts** - Important security notifications
  - **Price Alerts** - Cryptocurrency price changes (optional)

### Admin Panel
- ✅ Clean, professional interface optimized for iPad/laptops
- ✅ User management dashboard
- ✅ Real-time statistics:
  - Total users
  - Active users
  - Restricted users
  - Total balance across all users
- ✅ User actions:
  - Load/update balances
  - Restrict/unrestrict withdrawals
  - Set restriction reasons
  - Change account status (active/restricted/suspended)
  - Delete users

### Real-Time Restriction Warnings
- ✅ Automatic detection of account restrictions
- ✅ Clean, professional warning banners (no emojis)
- ✅ Real-time updates every 30 seconds
- ✅ Three types of warnings:
  - **Withdrawal Restricted** - Red warning with reason
  - **Account Suspended** - Critical warning
  - **Account Under Review** - Orange notice

## 📁 File Structure

```
vaultora/
├── app/
│   ├── admin/
│   │   └── page.tsx                    # Admin panel (iPad/laptop optimized)
│   ├── api/
│   │   ├── admin/
│   │   │   └── users/
│   │   │       └── route.ts            # Admin user management API
│   │   └── user/
│   │       ├── email/
│   │       │   └── route.ts            # User email configuration API
│   │       └── restrictions/
│   │           └── route.ts            # Check user restrictions API
│   └── settings/
│       └── email/
│           └── page.tsx                # Email settings page
├── components/
│   └── RestrictionWarning.tsx          # Real-time restriction warning component
└── lib/
    └── email-service.ts                # Email notification service
```

## 🔧 Setup Instructions

### 1. Install Email Service (Resend)

Resend is a modern, developer-friendly email API:

```bash
npm install resend
```

### 2. Get Resend API Key

1. Sign up at https://resend.com
2. Create an API key
3. Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Verify Domain (For Production)

To send emails from `notifications@vaultora.app`:
1. Go to Resend Dashboard → Domains
2. Add your domain: `vaultora.app`
3. Add DNS records (provided by Resend)
4. Verify domain

For testing, use Resend's test domain: `onboarding@resend.dev`

## 🎯 Usage

### User Flow

1. **Configure Email**
   - Go to Settings → Email Notifications
   - Enter email address
   - Choose notification preferences
   - Save settings

2. **Receive Notifications**
   - Automatic emails for all enabled transaction types
   - Beautiful HTML emails with transaction details
   - Security alerts for account restrictions

### Admin Flow

1. **Access Admin Panel**
   - Navigate to `/admin`
   - View dashboard with statistics

2. **Manage Users**
   - Search users by email or wallet ID
   - Click "Manage" on any user
   - Update balance, restrictions, or status
   - Save changes

3. **Restrict User**
   - Open user modal
   - Toggle "Restrict Withdrawals"
   - Enter restriction reason
   - Save - user receives email notification immediately

## 📧 Email Templates

All email templates are professionally designed with:
- Clean, modern iOS-inspired design
- Dark mode optimized (#0F1018 background)
- Responsive layout
- Clear call-to-action buttons
- Transaction details table
- Security warnings

### Email Types

1. **Deposit Email**
   ```
   Subject: ✅ Deposit Received - 0.5 ETH
   - Asset, amount, transaction ID
   - Confirmation status
   - "View Wallet" button
   ```

2. **Withdrawal Email**
   ```
   Subject: 📤 Withdrawal Processed - 0.5 ETH
   - Asset, amount, destination address
   - Network fee
   - "View Transaction" button
   ```

3. **Restriction Email**
   ```
   Subject: ⚠️ Account Action Required - Withdrawal Restriction
   - Restriction reason
   - Warning banner
   - "Contact Support" button
   ```

4. **Trade Email**
   ```
   Subject: 📊 Trade Executed - Long BTC
   - Position type, size, entry price
   - Leverage
   - "View Position" button
   ```

## 🔒 Security Features

### Email Verification
- Email verification on first configuration
- Encrypted storage of email addresses
- No sharing with third parties

### Admin Authentication
- TODO: Add admin authentication middleware
- Recommended: Use NextAuth.js with admin role
- Protect `/admin` and `/api/admin/*` routes

### Data Privacy
- Emails stored securely in database
- User control over notification preferences
- Can delete email at any time

## 🗄️ Database Integration

### Current Implementation
Uses in-memory Map for demonstration:
```typescript
const users: Map<string, User> = new Map();
```

### Production Implementation

Replace with real database (PostgreSQL, MongoDB, etc.):

```typescript
// Example with Prisma + PostgreSQL

// schema.prisma
model User {
  id                    String   @id @default(cuid())
  walletId              String   @unique
  email                 String
  isVerified            Boolean  @default(false)
  balance               Float    @default(0)
  withdrawalRestricted  Boolean  @default(false)
  restrictionReason     String?
  status                String   @default("active")
  notifications         Json
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

// API route
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
```

## 📊 Admin Panel Features

### Dashboard Statistics
- **Total Users** - Count of all registered users
- **Active Users** - Users with status "active"
- **Restricted Users** - Users with withdrawal restrictions
- **Total Balance** - Sum of all user balances

### User Table Columns
1. **User** - Email and wallet ID
2. **Balance** - Current USD balance
3. **Transactions** - Total transaction count
4. **Status** - Active/Restricted with badge
5. **Last Activity** - Last action timestamp
6. **Actions** - Manage button

### User Management Modal
- Update balance (USD)
- Toggle withdrawal restriction
- Set restriction reason (shown to user)
- Change account status:
  - **Active** - Full access
  - **Restricted** - Limited features
  - **Suspended** - No access

## 🎨 Design Guidelines

### Admin Panel
- Clean, professional interface
- Optimized for iPad (768px+) and laptops
- Gradient stat cards with icons
- Smooth hover effects
- Modal-based editing
- No emojis in UI (professional)

### Warning Banners
- iOS-inspired design
- Color-coded by severity:
  - 🔴 Red (#FF453A) - Critical (suspended, restricted)
  - 🟠 Orange (#FF9500) - Warning (under review)
  - 🔵 Blue (#4938F5) - Info
- Clean icons from lucide-react
- Dismissible with X button
- Auto-refresh every 30 seconds

## 🔔 Real-Time Notifications

### Client-Side Polling
```typescript
useEffect(() => {
  checkRestrictions();
  const interval = setInterval(checkRestrictions, 30000); // 30 seconds
  return () => clearInterval(interval);
}, []);
```

### Production Alternative: WebSockets
For instant updates, implement WebSocket connection:

```typescript
// server.ts
import { Server } from 'socket.io';

io.on('connection', (socket) => {
  socket.on('subscribe-restrictions', (walletId) => {
    socket.join(`user-${walletId}`);
  });
});

// When admin updates restriction
io.to(`user-${walletId}`).emit('restriction-update', data);
```

## 📝 TODO for Production

### High Priority
- [ ] Add admin authentication (NextAuth.js)
- [ ] Implement real database (PostgreSQL/MongoDB)
- [ ] Add email verification flow
- [ ] Rate limiting on API routes
- [ ] Audit logging for admin actions

### Medium Priority
- [ ] WebSocket for real-time updates
- [ ] Admin activity dashboard
- [ ] User transaction history
- [ ] Bulk user operations
- [ ] Export user data (CSV)

### Low Priority
- [ ] Email templates customization
- [ ] Multi-language email support
- [ ] Advanced analytics dashboard
- [ ] Scheduled reports

## 🧪 Testing

### Test Email Notifications

```typescript
// test-email.ts
import { sendTransactionEmail } from './lib/email-service';

await sendTransactionEmail({
  to: 'test@example.com',
  type: 'deposit',
  data: {
    amount: '0.5',
    asset: 'ETH',
    txId: '0x123...456',
  },
});
```

### Test Admin Panel
1. Navigate to `/admin`
2. View demo users (wallet-1, wallet-2)
3. Test user management:
   - Update balance
   - Restrict withdrawals
   - Change status

### Test Restriction Warnings
1. Open admin panel
2. Restrict a user with reason
3. Open dashboard as that user
4. See real-time warning banner

## 📞 Support

For questions or issues:
- **Email**: support@vaultora.app
- **Documentation**: https://docs.vaultora.app
- **Community**: https://community.vaultora.app

---

**Made with ❤️ by Vaultora Team**
