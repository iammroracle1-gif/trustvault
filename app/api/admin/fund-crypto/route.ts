// API endpoint for admin to fund users with cryptocurrency
import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletId, addToCryptoBalance, addCryptoTransaction } from '@/lib/database';
import { getCryptoPrice, cryptoToUsd } from '@/lib/crypto-prices';
import { sendDepositApprovedEmail } from '@/lib/email-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletId, currency, amount, note, adminPassword } = body;

    // Validate admin password
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    // Validate inputs
    if (!walletId || !currency || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Supported currencies
    const supportedCurrencies = ['BTC', 'ETH', 'BNB', 'SOL', 'USDT'];
    if (!supportedCurrencies.includes(currency)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported currency' },
        { status: 400 }
      );
    }

    // Get user
    const user = await getUserByWalletId(walletId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get current price and calculate USD value
    const priceUsd = await getCryptoPrice(currency);
    const usdValue = amount * priceUsd;

    // Add to user's crypto balance
    const newBalance = await addToCryptoBalance(walletId, currency, amount);
    
    if (!newBalance) {
      throw new Error('Failed to update crypto balance');
    }

    // Record transaction
    await addCryptoTransaction({
      userId: walletId,
      type: 'admin_deposit',
      currency,
      cryptoAmount: amount,
      usdAmount: usdValue,
      note: note || `Admin funded ${amount} ${currency}`,
      adminId: 'admin',
    });

    // Create in-app notification entry (for notification system)
    try {
      const { sql } = await import('@vercel/postgres');
      await sql`
        INSERT INTO deposit_requests (
          wallet_id,
          amount,
          crypto,
          status,
          created_at
        ) VALUES (
          ${walletId},
          ${usdValue},
          ${currency},
          'approved',
          NOW()
        )
      `;
      console.log(`✅ Created in-app notification for ${currency} deposit`);
    } catch (notifError) {
      console.error('Failed to create notification entry:', notifError);
      // Don't fail the request if notification fails
    }

    // Send email notification
    try {
      await sendDepositApprovedEmail({
        email: user.email,
        amount: usdValue,
        crypto: currency,
        exchange: 'Admin',
        transactionId: `ADMIN-${Date.now()}`,
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    console.log(`✅ Admin funded ${user.email}: ${amount} ${currency} ($${usdValue.toFixed(2)})`);

    return NextResponse.json({
      success: true,
      message: `Successfully funded ${amount} ${currency}`,
      currency,
      cryptoAmount: amount,
      usdValue,
      newBalance: newBalance.amount,
      priceUsd,
    });
  } catch (error: any) {
    console.error('Error in admin fund crypto API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fund user',
      },
      { status: 500 }
    );
  }
}
