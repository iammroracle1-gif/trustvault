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
      
      console.log('💾 Attempting to insert notification:', {
        walletId,
        amount: usdValue,
        crypto: currency,
        timestamp: new Date().toISOString()
      });
      
      // First, try to insert with approved_at
      try {
        const result = await sql`
          INSERT INTO deposit_requests (
            wallet_id,
            amount,
            crypto,
            status,
            created_at,
            approved_at
          ) VALUES (
            ${walletId},
            ${usdValue},
            ${currency},
            'approved',
            NOW(),
            NOW()
          )
          RETURNING id, approved_at
        `;
        console.log(`✅ Created in-app notification for ${currency} deposit:`, {
          notificationId: result.rows[0]?.id,
          approvedAt: result.rows[0]?.approved_at,
          walletId,
          currency,
          usdValue
        });
      } catch (insertError: any) {
        // If approved_at column doesn't exist, try without it
        if (insertError.message?.includes('approved_at')) {
          console.log('⚠️ approved_at column missing, trying without it...');
          const result = await sql`
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
            RETURNING id, created_at
          `;
          console.log(`✅ Created in-app notification for ${currency} deposit (no approved_at):`, {
            notificationId: result.rows[0]?.id,
            createdAt: result.rows[0]?.created_at,
            walletId,
            currency,
            usdValue
          });
        } else {
          throw insertError;
        }
      }
    } catch (notifError) {
      console.error('❌ Failed to create notification entry:', notifError);
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
