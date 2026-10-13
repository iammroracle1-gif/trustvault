import { NextResponse } from 'next/server';

// Custom fetch with SSL workaround for development
async function safeFetch(url: string, options?: RequestInit) {
  try {
    return await fetch(url, options);
  } catch (error: any) {
    const isSSLError = error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || 
                       error.message?.includes('certificate') ||
                       error.cause?.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE';
    
    if (isSSLError && process.env.NODE_ENV === 'development') {
      console.warn('⚠️  SSL verification failed, trying http://...');
      const httpUrl = url.replace('https://', 'http://');
      return await fetch(httpUrl, options);
    }
    throw error;
  }
}

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Fetch directly from CoinPaprika
    console.log('🔍 Debugging BTC price from CoinPaprika...');
    
    const response = await safeFetch('https://api.coinpaprika.com/v1/tickers/btc-bitcoin', {
      headers: {
        'Accept': 'application/json',
      },
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extract all relevant price information
    const diagnostics = {
      investigation: {
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        endpoint: 'https://api.coinpaprika.com/v1/tickers/btc-bitcoin',
        provider: 'CoinPaprika',
      },
      btcData: {
        id: data.id,
        name: data.name,
        symbol: data.symbol,
        rank: data.rank,
        priceUSD: data.quotes?.USD?.price,
        volume24h: data.quotes?.USD?.volume_24h,
        marketCap: data.quotes?.USD?.market_cap,
        percentChange1h: data.quotes?.USD?.percent_change_1h,
        percentChange24h: data.quotes?.USD?.percent_change_24h,
        percentChange7d: data.quotes?.USD?.percent_change_7d,
        athPrice: data.quotes?.USD?.ath_price,
        athDate: data.quotes?.USD?.ath_date,
        lastUpdatedAPI: data.last_updated,
      },
      caching: {
        serverCache: 'Bypassed (cache: no-store)',
        nextJsRevalidate: 'Disabled',
        browserCache: 'Disabled via headers',
      },
      comparison: {
        ourDisplayedPrice: 82671,
        trustWalletPrice: 83587.02,
        coinPaprikaRawPrice: data.quotes?.USD?.price,
        difference: Math.abs((data.quotes?.USD?.price || 0) - 83587.02),
        percentDifference: (((data.quotes?.USD?.price || 0) - 83587.02) / 83587.02 * 100).toFixed(2) + '%',
      },
      rawAPIResponse: data,
    };

    return NextResponse.json(diagnostics, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
    }, { status: 500 });
  }
}
