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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
        margin: 0; 
        padding: 0; 
        background-color: #000000; 
      }
      .container { 
        max-width: 600px; 
        margin: 0 auto; 
        background-color: #000000; 
      }
      .header { 
        padding: 20px 24px; 
        text-align: right;
      }
      .logo { 
        width: 24px;
        height: 24px;
        opacity: 0.6;
      }
      .content { 
        padding: 24px; 
      }
      .title { 
        font-size: 18px; 
        font-weight: 600; 
        margin: 0 0 8px 0; 
        color: #FFFFFF; 
      }
      .message { 
        font-size: 14px; 
        line-height: 1.6; 
        color: #666666; 
        margin: 0 0 16px 0; 
      }
      .detail-box { 
        background-color: #0a0a0a; 
        border: 1px solid #1a1a1a;
        border-radius: 8px; 
        padding: 16px; 
        margin: 16px 0; 
      }
      .detail-row { 
        display: flex; 
        justify-content: space-between; 
        padding: 8px 0; 
      }
      .detail-label { 
        color: #666666; 
        font-size: 13px; 
      }
      .detail-value { 
        color: #FFFFFF; 
        font-size: 13px; 
        font-weight: 500; 
      }
      .button { 
        display: inline-block; 
        padding: 12px 20px; 
        background-color: #FFFFFF; 
        color: #000000; 
        text-decoration: none; 
        border-radius: 6px; 
        font-weight: 500; 
        font-size: 14px;
        margin-top: 8px; 
      }
      .footer { 
        padding: 20px 24px; 
        text-align: center; 
        color: #666666; 
        font-size: 12px; 
        border-top: 1px solid #1a1a1a; 
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
                  <img src="https://trust-vault.live/logo.png" alt="" class="logo" />
                </div>
                <div class="content">
                  <h1 class="title">${notification.data.title || 'Security Notification'}</h1>
                  <p class="message">${notification.data.message || 'You have a new security notification.'}</p>
                  ${notification.data.walletAddress ? `
                  <div class="detail-box">
                    <div class="detail-row">
                      <span class="detail-label">Wallet Address</span>
                    </div>
                    <div style="margin-top: 8px; padding: 12px; background-color: #000000; border-radius: 8px; word-break: break-all;">
                      <span style="color: #FFFFFF; font-size: 13px; font-family: monospace;">${notification.data.walletAddress}</span>
                    </div>
                    ${notification.data.deviceInfo ? `
                    <div class="detail-row" style="margin-top: 12px;">
                      <span class="detail-label">Device</span>
                      <span class="detail-value">${notification.data.deviceInfo}</span>
                    </div>
                    ` : ''}
                    ${notification.data.loginTime ? `
                    <div class="detail-row" style="margin-top: 12px;">
                      <span class="detail-label">Time</span>
                      <span class="detail-value">${new Date(notification.data.loginTime).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZoneName: 'short'
                      })}</span>
                    </div>
                    ` : ''}
                  </div>
                  ` : ''}
                  <a href="https://trust-vault.live" class="button">Open Trust Vault</a>
                </div>
                <div class="footer">
                  <p>Trust Vault</p>
                  <p style="margin-top: 8px;">If you didn't perform this action, secure your account immediately.</p>
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
                  <img src="https://trust-vault.live/logo.png" alt="" class="logo" />
                </div>
                <div class="content">
                  <h1 class="title">Deposit Confirmed</h1>
                  <p class="message">You've received ${notification.data.amount} ${notification.data.asset} to your wallet.</p>
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
                  <p>Trust Vault</p>
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
                  <img src="https://trust-vault.live/logo.png" alt="" class="logo" />
                </div>
                <div class="content">
                  <h1 class="title">Notification</h1>
                  <p class="message">You have a new notification from Trust Vault.</p>
                  <a href="https://trust-vault.live" class="button">Open Trust Vault</a>
                </div>
                <div class="footer">
                  <p>Trust Vault</p>
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

// Deposit Approved Email
export async function sendDepositApprovedEmail(data: {
  email: string;
  amount: number;
  crypto: string;
  exchange: string;
  transactionId: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return;
    }

    const baseStyles = `
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
          margin: 0; 
          padding: 0; 
          background-color: #000000; 
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #000000; 
        }
        .header { 
          padding: 20px 24px; 
          text-align: right;
        }
        .logo { 
          width: 24px;
          height: 24px;
          opacity: 0.6;
        }
        .content { 
          padding: 24px; 
        }
        .title { 
          font-size: 18px; 
          font-weight: 600; 
          margin: 0 0 8px 0; 
          color: #FFFFFF; 
        }
        .amount {
          font-size: 24px;
          font-weight: 600;
          color: #FFFFFF;
          margin: 12px 0;
        }
        .message { 
          font-size: 14px; 
          line-height: 1.6; 
          color: #666666; 
          margin: 0 0 16px 0; 
        }
        .detail-box { 
          background-color: #0a0a0a; 
          border: 1px solid #1a1a1a;
          border-radius: 8px; 
          padding: 16px; 
          margin: 16px 0; 
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 8px 0; 
        }
        .detail-label { 
          color: #666666; 
          font-size: 13px; 
        }
        .detail-value { 
          color: #FFFFFF; 
          font-size: 13px; 
          font-weight: 500; 
        }
        .button { 
          display: inline-block; 
          padding: 12px 20px; 
          background-color: #FFFFFF; 
          color: #000000; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 500; 
          font-size: 14px;
          margin-top: 8px; 
        }
        .footer { 
          padding: 20px 24px; 
          text-align: center; 
          color: #666666; 
          font-size: 12px; 
          border-top: 1px solid #1a1a1a; 
        }
      </style>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Trust Vault <notifications@trust-vault.live>',
        to: data.email,
        subject: `Deposit Received - $${data.amount.toLocaleString()} ${data.crypto}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>${baseStyles}</head>
            <body>
              <div class="container">
                <div class="header">
                  <img src="https://trust-vault.live/logo.png" alt="" class="logo" />
                </div>
                <div class="content">
                  <h1 class="title">Deposit Confirmed</h1>
                  <div class="amount">+${data.amount.toLocaleString()}</div>
                  <p class="message">Your ${data.crypto} deposit has been credited to your wallet.</p>
                  
                  <div class="detail-box">
                    <div class="detail-row">
                      <span class="detail-label">Currency</span>
                      <span class="detail-value">${data.crypto}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Amount (USD)</span>
                      <span class="detail-value">$${data.amount.toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">From</span>
                      <span class="detail-value">${data.exchange}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Transaction ID</span>
                      <span class="detail-value" style="font-family: monospace; font-size: 12px;">${data.transactionId}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Status</span>
                      <span class="detail-value">Completed</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Time</span>
                      <span class="detail-value">${new Date().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <a href="https://trust-vault.live/dashboard" class="button">View Balance</a>
                  
                  <p class="message" style="margin-top: 20px;">
                    Your funds are now available.
                  </p>
                </div>
                <div class="footer">
                  <p>Trust Vault</p>
                  <p style="margin-top: 8px;">If you didn't make this deposit, contact support immediately.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('Deposit email sent successfully to', data.email, 'ID:', result.id);
    return result;
  } catch (error) {
    console.error('Error sending deposit email:', error);
    throw error;
  }
}
