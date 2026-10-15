import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletId, updateLastLogin } from '@/lib/database';
import { sendTransactionEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletId } = body;

    if (!walletId) {
      return NextResponse.json({
        success: false,
        error: 'Wallet ID is required',
      }, { status: 400 });
    }

    // Get user from database
    const user = await getUserByWalletId(walletId);

    if (!user) {
      // User not registered in database yet - this is OK for imported wallets
      console.log('⚠️ User not found in database:', walletId);
      return NextResponse.json({
        success: true,
        message: 'Wallet not registered yet. Please register your email to enable notifications.',
        data: {
          walletId,
          email: null,
          registered: false,
        },
      });
    }

    // Check if user is deleted or suspended
    if (user.status === 'deleted' || user.status === 'suspended') {
      return NextResponse.json({
        success: false,
        error: 'This account has been disabled. Please contact support.',
      }, { status: 403 });
    }

    // Update last login time
    await updateLastLogin(walletId);

    // Send login notification email with device info
    try {
      // Get device/browser info from headers
      const userAgent = request.headers.get('user-agent') || 'Unknown device';
      const deviceInfo = parseUserAgent(userAgent);
      
      console.log('📧 Sending login notification email to:', user.email);
      console.log('📱 Device info:', deviceInfo);
      
      await sendTransactionEmail({
        to: user.email,
        type: 'security',
        data: {
          title: 'New Login Detected',
          message: `A login was detected on your Trust Vault account on ${new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}.\n\nDevice: ${deviceInfo.device}\nBrowser: ${deviceInfo.browser}\nOS: ${deviceInfo.os}`,
          walletAddress: user.wallet_address,
          loginTime: new Date().toISOString(),
          deviceInfo: `${deviceInfo.browser} on ${deviceInfo.os}`,
        },
      });
      console.log('✅ Login email sent successfully to:', user.email);
    } catch (emailError) {
      console.error('❌ Login email notification failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      data: {
        walletId: user.wallet_id,
        email: user.email,
        lastLogin: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Login tracking error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to track login',
    }, { status: 500 });
  }
}

// Parse user agent to get device info
function parseUserAgent(ua: string) {
  const device = /mobile|android|iphone|ipad|tablet/i.test(ua) ? 'Mobile Device' : 'Desktop';
  
  let browser = 'Unknown Browser';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  else if (ua.includes('Opera')) browser = 'Opera';
  
  let os = 'Unknown OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  
  return { device, browser, os };
}
