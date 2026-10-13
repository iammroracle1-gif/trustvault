import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Check if API key exists
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not configured in environment variables',
      }, { status: 500 });
    }

    // Try to send test email
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Trust Vault <onboarding@resend.dev>',
        to: email,
        subject: 'Test Email from Trust Vault',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0F1018; color: white;">
            <h1 style="color: #4938F5;">Trust Vault Email Test</h1>
            <p>If you're reading this, email configuration is working!</p>
            <p>Time: ${new Date().toISOString()}</p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'Resend API error',
        details: data,
        status: response.status,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: data.id,
      data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET() {
  const hasApiKey = !!process.env.RESEND_API_KEY;
  const apiKeyPreview = process.env.RESEND_API_KEY 
    ? `${process.env.RESEND_API_KEY.substring(0, 10)}...`
    : 'NOT SET';

  return NextResponse.json({
    configured: hasApiKey,
    apiKeyPreview,
    message: hasApiKey 
      ? 'Resend API key is configured. Use POST with {"email": "your@email.com"} to send test email.'
      : 'Resend API key is NOT configured. Add RESEND_API_KEY to Vercel environment variables.',
  });
}
