// API endpoint to get user's cryptocurrency balances
import { NextRequest, NextResponse } from 'next/server';
import { getCryptoBalances, getUserByWalletId, migrateUserToMultiCurrency } from '@/lib/database';
import { fetchCryptoPrices } from '@/lib/crypto-prices';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletId = searchParams.get('walletId');
    const walletAddress = searchParams.get('wallet_address');

    if (!walletId && !walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet ID or address required' },
        { status: 400 }
      );
    }

    // Get user
    let user = walletId 
      ? await getUserByWalletId(walletId)
      : null;

    if (!user && walletAddress) {
      // Lookup by address if wallet_id lookup failed
      const { sql } = await import('@vercel/postgres');
      const result = await sql`
        SELECT * FROM users WHERE wallet_address = ${walletAddress}
      `;
      user = result.rows[0] as any;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user needs migration
    if (user.balance > 0 && !user.migrated_to_crypto) {
      console.log('🔄 Migrating user to multi-currency:', user.email);
      await migrateUserToMultiCurrency(user.wallet_id);
    }

    // Get crypto balances
    const balances = await getCryptoBalances(user.wallet_id);
    
    // Get current prices
    const prices = await fetchCryptoPrices();

    // Calculate USD values
    const balancesWithUsd = balances.map(balance => ({
      currency: balance.currency,
      amount: parseFloat(balance.amount.toString()),
      usdValue: parseFloat(balance.amount.toString()) * (prices[balance.currency]?.priceUsd || 0),
      priceUsd: prices[balance.currency]?.priceUsd || 0,
      changePercent24Hr: prices[balance.currency]?.changePercent24Hr || 0,
    }));

    // Calculate total balance in USD
    const totalUsd = balancesWithUsd.reduce((sum, b) => sum + b.usdValue, 0);

    // Calculate total balance in BTC
    const btcPrice = prices.BTC?.priceUsd || 83650;
    const totalBtc = totalUsd / btcPrice;

    return NextResponse.json({
      success: true,
      balances: balancesWithUsd,
      totalUsd,
      totalBtc,
      prices,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in crypto balances API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crypto balances',
      },
      { status: 500 }
    );
  }
}
