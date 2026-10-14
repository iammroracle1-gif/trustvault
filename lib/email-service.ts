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
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif; 
        margin: 0; 
        padding: 0; 
        background-color: #000000; 
      }
      .container { 
        max-width: 600px; 
        margin: 0 auto; 
        background-color: #1C1C1E; 
      }
      .header { 
        padding: 32px 24px; 
        border-bottom: 1px solid #2C2C2E;
      }
      .logo { 
        color: #FFFFFF; 
        font-size: 20px; 
        font-weight: 600; 
        letter-spacing: -0.5px;
      }
      .content { 
        padding: 32px 24px; 
      }
      .title { 
        font-size: 22px; 
        font-weight: 600; 
        margin: 0 0 12px 0; 
        color: #FFFFFF; 
        letter-spacing: -0.5px;
      }
      .message { 
        font-size: 15px; 
        line-height: 1.5; 
        color: #8E8E93; 
        margin: 0 0 24px 0; 
      }
      .detail-box { 
        background-color: #2C2C2E; 
        border-radius: 12px; 
        padding: 16px; 
        margin: 24px 0; 
      }
      .detail-row { 
        display: flex; 
        justify-content: space-between; 
        padding: 8px 0; 
      }
      .detail-label { 
        color: #8E8E93; 
        font-size: 14px; 
      }
      .detail-value { 
        color: #FFFFFF; 
        font-size: 14px; 
        font-weight: 500; 
      }
      .button { 
        display: inline-block; 
        padding: 12px 24px; 
        background-color: #FFFFFF; 
        color: #000000; 
        text-decoration: none; 
        border-radius: 12px; 
        font-weight: 500; 
        font-size: 15px;
        margin-top: 8px; 
      }
      .footer { 
        padding: 24px; 
        text-align: center; 
        color: #8E8E93; 
        font-size: 13px; 
        border-top: 1px solid #2C2C2E; 
      }
    </style>
  `;

  switch (notification.type) {
    case 'security':
      return {
        subject: notification.data.title || 'Trust Vault Security Notification',
        html: `
          <!DOCTYPE html>
          <html>
            <head>${baseStyles}</head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">Trust Vault</div>
                </div>
                <div class="content">
                  <h1 class="title">${notification.data.title || 'Security Notification'}</h1>
                  <p class="message">${notification.data.message || 'You have a new security notification.'}</p>
                  ${notification.data.walletAddress ? `
                  <div class="detail-box">
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
                  <a href="https://trust-vault.live" class="button">Open Trust Vault</a>
                </div>
                <div class="footer">
                  <p>Trust Vault - Secure Cryptocurrency Wallet</p>
                  <p style="margin-top: 8px;">If you didn't perform this action, please secure your account immediately.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

    case 'deposit':
      return {
        subject: `Deposit Received - ${notification.data.amount} ${notification.data.asset}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>${baseStyles}</head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">Trust Vault</div>
                </div>
                <div class="content">
                  <h1 class="title">Deposit Confirmed</h1>
                  <p class="message">You've successfully received ${notification.data.amount} ${notification.data.asset} to your wallet.</p>
                  <div class="detail-box">
                    <div class="detail-row">
                      <span class="detail-label">Asset</span>
                      <span class="detail-value">${notification.data.asset}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Amount</span>
                      <span class="detail-value">${notification.data.amount}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Status</span>
                      <span class="detail-value">Confirmed</span>
                    </div>
                  </div>
                  <a href="https://trust-vault.live/dashboard" class="button">View Wallet</a>
                </div>
                <div class="footer">
                  <p>Trust Vault - Secure Cryptocurrency Wallet</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

    default:
      return {
        subject: 'Trust Vault Notification',
        html: `
          <!DOCTYPE html>
          <html>
            <head>${baseStyles}</head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">Trust Vault</div>
                </div>
                <div class="content">
                  <h1 class="title">Notification</h1>
                  <p class="message">You have a new notification from Trust Vault.</p>
                  <a href="https://trust-vault.live" class="button">Open Trust Vault</a>
                </div>
                <div class="footer">
                  <p>Trust Vault - Secure Cryptocurrency Wallet</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };
  }
}

// Export for use in API routes
export { generateEmailContent };
