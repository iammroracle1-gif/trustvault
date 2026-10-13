# Email Notifications Setup

## Why You're Not Receiving Emails

The app is configured to send email notifications for:
- New account creation
- User login
- Deposits
- Withdrawals
- Account restrictions

However, **emails require an API key** from an email service provider. Currently, the `RESEND_API_KEY` environment variable is not set, so emails are logged but not sent.

## How to Enable Email Notifications

### Option 1: Resend (Recommended - Free tier available)

1. **Sign up for Resend**: https://resend.com/signup
2. **Get your API key**: 
   - Go to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Add to Vercel**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add new variable:
     - Key: `RESEND_API_KEY`
     - Value: `re_your_api_key_here`
     - Check: Production, Preview, Development
   - Redeploy your project

4. **Verify domain** (for production):
   - Add your domain in Resend dashboard
   - Update `from` email in `lib/email-service.ts`:
     ```typescript
     from: 'Trust Vault <notifications@yourdomain.com>',
     ```

### Option 2: SendGrid (Alternative)

If you prefer SendGrid instead:

1. Sign up at https://sendgrid.com
2. Get API key
3. Modify `lib/email-service.ts` to use SendGrid API
4. Add `SENDGRID_API_KEY` to Vercel environment variables

### Option 3: Development/Testing (No real emails)

For development, you can use a service that captures emails without sending them:

- **Mailtrap**: https://mailtrap.io (free testing inbox)
- **MailHog**: Local email testing tool

## Testing Email Notifications

Once you add the API key and redeploy:

1. **Create a new wallet** with a real email address
2. Check your inbox for "Welcome to Trust Vault" email
3. **Login to your wallet** - you should receive a login notification
4. **Admin deposits funds** - user receives deposit notification

## Troubleshooting

**Emails still not sending?**
- Check Vercel deployment logs for errors
- Verify API key is correct
- Check spam/junk folder
- Ensure email domain is verified (for production)

**Want to disable emails temporarily?**
- Keep the code as is - it will gracefully fail without API key
- Check console logs to see what would have been sent

## Current Email Service Code Location

- Email service: `lib/email-service.ts`
- Deposit notifications: `app/api/admin/deposit/route.ts`
- Login notifications: `app/api/user/login/route.ts`
- Registration: `app/api/user/register/route.ts`
