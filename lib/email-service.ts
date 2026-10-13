// Email Service for Transaction Notifications
// Uses Resend API (https://resend.com) - Clean, modern email API
// Alternative: SendGrid, AWS SES, or Mailgun

interface EmailNotification {
  to: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'trade' | 'security' | 'restriction';
  data: any;
}

export async function sendTransactionEmail(notification: EmailNotification) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return;
    }

    // Generate email content based on type
    const emailContent = generateEmailContent(notification);

    console.log('Attempting to send email to:', notification.to);

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Trust Vault <notifications@trust-vault.live>',
        to: notification.to,
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('Email sent successfully to', notification.to, 'ID:', result.id);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

async function getUserEmailPreferences(walletId: string) {
  // In production, fetch from your database
  // For now, return mock data
  return {
    enabled: true,
    email: 'user@example.com',
    notifications: {
      deposits: true,
      withdrawals: true,
      transfers: true,
      trades: true,
      security: true,
      priceAlerts: false,
    },
  };
}

function generateEmailContent(notification: EmailNotification) {
  const baseStyles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #0F1018; }
      .container { max-width: 600px; margin: 0 auto; background-color: #1C1C1E; }
      .header { background: linear-gradient(135deg, #4938F5 0%, #7D7AFF 100%); padding: 40px 20px; text-align: center; }
      .content { padding: 40px 20px; color: #FFFFFF; }
      .title { font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #FFFFFF; }
      .message { font-size: 16px; line-height: 1.6; color: #8E8E93; margin-bottom: 24px; }
      .details { background-color: #2C2C2E; border-radius: 12px; padding: 20px; margin: 24px 0; }
      .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #48484A; }
      .detail-row:last-child { border-bottom: none; }
      .detail-label { color: #8E8E93; font-size: 14px; }
      .detail-value { color: #FFFFFF; font-size: 14px; font-weight: 600; }
      .button { display: inline-block; padding: 12px 24px; background-color: #4938F5; color: #FFFFFF; text-decoration: none; border-radius: 12px; font-weight: 600; margin-top: 20px; }
      .footer { padding: 20px; text-align: center; color: #8E8E93; font-size: 12px; border-top: 1px solid #48484A; }
      .warning { background-color: #FF453A20; border: 1px solid #FF453A40; border-radius: 12px; padding: 16px; margin: 20px 0; }
      .warning-title { color: #FF453A; font-weight: 600; margin-bottom: 8px; }
    </style>
  `;

  switch (notification.type) {
    case 'deposit':
      return {
        subject: `✅ Deposit Received - ${notification.data.amount} ${notification.data.asset}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>${baseStyles}</head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="color: white; margin: 0;">💰 Deposit Received</h1>
                </div>
                <div class="content">
                  <h2 class="title">Your deposit has been confirmed</h2>
                  <p class="message">
                    You've successfully received ${notification.data.amount} ${notification.data.asset} to your Vaultora wallet.
                  </p>
                  <div class="details">
                    <div class="detail-row">
                      <span class="detail-label">Asset</span>
                      <span class="detail-value">${notification.data.asset}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Amount</span>
                      <span class="detail-value">${notification.data.amount}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Transaction ID</span>
                      <span class="detail-value">${notification.data.txId?.slice(0, 20)}...</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Status</span>
                      <span class="detail-value" style="color: #34C759;">Confirmed</span>
                    </div>
                  </div>
                  <a href="https://vaultora.app/dashboard" class="button">View Wallet</a>
                </div>
                <div class="footer">
                  <p>This is an automated notification from Vaultora.</p>
                  <p>If you didn't make this transaction, please contact support immediately.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

    case 'withdrawal':
      return {
        subject: `📤 Withdrawal Processed - ${notification.data.amount} ${notification.data.asset}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>${baseStyles}</head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="color: white; margin: 0;">📤 Withdrawal Processed</h1>
                </div>
                <div class="content">
                  <h2 class="title">Your withdrawal is complete</h2>
                  <p class="message">
                    You've successfully sent ${notification.data.amount} ${notification.data.asset} from your Vaultora wallet.
                  </p>
                  <div class="details">
                    <div class="detail-row">
                      <span class="detail-label">Asset</span>
                      <span class="detail-value">${notification.data.asset}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Amount</span>
                      <span class="detail-value">${notification.data.amount}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">To Address</span>
                      <span class="detail-value">${notification.data.toAddress?.slice(0, 20)}...</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Network Fee</span>
                      <span class="detail-value">${notification.data.fee || '0.001'} ${notification.data.asset}</span>
                    </div>
                  </div>
                  <a href="https://vaultora.app/dashboard" class="button">View Transaction</a>
                </div>
                <div class="footer">
                  <p>This is an automated notification from Vaultora.</p>
                  <p>If you didn't make this transaction, please contact support immediately.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

    case 'restriction':
      return {
        subject: `⚠️ Account Action Required - Withdrawal Restriction`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>${baseStyles}</head>
            <body>
              <div class="container">
                <div class="header" style="background: linear-gradient(135deg, #FF453A 0%, #FF9500 100%);">
                  <h1 style="color: white; margin: 0;">⚠️ Account Restriction</h1>
                </div>
                <div class="content">
                  <h2 class="title">Your account has been restricted</h2>
                  <div class="warning">
                    <div class="warning-title">Withdrawal Restriction Active</div>
                    <p style="color: #8E8E93; margin: 0;">
                      ${notification.data.reason || 'Your account is currently under review. Withdrawals have been temporarily disabled.'}
                    </p>
                  </div>
                  <p class="message">
                    If you believe this is an error or have questions, please contact our support team immediately.
                  </p>
                  <a href="mailto:support@vaultora.app" class="button">Contact Support</a>
                </div>
                <div class="footer">
                  <p>This is an automated security notification from Vaultora.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

    case 'trade':
      return {
        subject: `📊 Trade Executed - ${notification.data.type}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>${baseStyles}</head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="color: white; margin: 0;">📊 Trade Executed</h1>
                </div>
                <div class="content">
                  <h2 class="title">Your ${notification.data.type} position is open</h2>
                  <p class="message">
                    Your perpetual futures trade has been successfully executed.
                  </p>
                  <div class="details">
                    <div class="detail-row">
                      <span class="detail-label">Position</span>
                      <span class="detail-value">${notification.data.type} ${notification.data.asset}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Size</span>
                      <span class="detail-value">${notification.data.size}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Entry Price</span>
                      <span class="detail-value">$${notification.data.price}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Leverage</span>
                      <span class="detail-value">${notification.data.leverage}x</span>
                    </div>
                  </div>
                  <a href="https://trustvault-beige.vercel.app/perps" class="button">View Position</a>
                </div>
                <div class="footer">
                  <p>This is an automated notification from Trust Vault.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

    case 'security':
      return {
        subject: notification.data.title || '🔐 Trust Vault Security Alert',
        html: `
          <!DOCTYPE html>
          <html>
            <head>${baseStyles}</head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="color: white; margin: 0;">🔐 ${notification.data.title || 'Security Alert'}</h1>
                </div>
                <div class="content">
                  <h2 class="title">${notification.data.title || 'Security Notification'}</h2>
                  <p class="message">
                    ${notification.data.message || 'You have a new security notification.'}
                  </p>
                  ${notification.data.walletAddress ? `
                  <div class="details">
                    <div class="detail-row">
                      <span class="detail-label">Wallet Address</span>
                      <span class="detail-value">${notification.data.walletAddress.slice(0, 20)}...</span>
                    </div>
                    ${notification.data.loginTime ? `
                    <div class="detail-row">
                      <span class="detail-label">Time</span>
                      <span class="detail-value">${new Date(notification.data.loginTime).toLocaleString()}</span>
                    </div>
                    ` : ''}
                  </div>
                  ` : ''}
                  <a href="https://trustvault-beige.vercel.app/dashboard" class="button">Open Trust Vault</a>
                </div>
                <div class="footer">
                  <p>This is an automated notification from Trust Vault.</p>
                  <p>If you didn't perform this action, please secure your account immediately.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

    default:
      return {
        subject: 'Trust Vault Notification',
        html: `<p>You have a new notification from Trust Vault.</p>`,
      };
  }
}

// Export for use in API routes
export { generateEmailContent };
