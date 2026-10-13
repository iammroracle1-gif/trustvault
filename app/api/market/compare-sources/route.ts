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
    console.log('🔍 Comparing BTC prices from multiple sources...');
    
    // Source 1: CoinPaprika
    const coinPaprikaStart = Date.now();
    const coinPaprikaRes = await safeFetch('https://api.coinpaprika.com/v1/tickers/btc-bitcoin', {
      headers: { 'Accept': 'application/json' },
    });
    const coinPaprikaData = await coinPaprikaRes.json();
    const coinPaprikaTime = Date.now() - coinPaprikaStart;

    // Source 2: CoinGecko (Free API)
    const coinGeckoStart = Date.now();
    const coinGeckoRes = await safeFetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true', {
      headers: { 'Accept': 'application/json' },
    });
    const coinGeckoData = await coinGeckoRes.json();
    const coinGeckoTime = Date.now() - coinGeckoStart;

    // Source 3: Binance Public API
    const binanceStart = Date.now();
    const binanceRes = await safeFetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', {
      headers: { 'Accept': 'application/json' },
    });
    const binanceData = await binanceRes.json();
    const binanceTime = Date.now() - binanceStart;

    const totalTime = Date.now() - startTime;

    const comparison = {
      timestamp: new Date().toISOString(),
      totalResponseTime: `${totalTime}ms`,
      
      sources: {
        coinPaprika: {
          price: coinPaprikaData.quotes?.USD?.price,
          lastUpdated: coinPaprikaData.last_updated,
          responseTime: `${coinPaprikaTime}ms`,
          endpoint: 'https://api.coinpaprika.com/v1/tickers/btc-bitcoin',
          currency: 'USD',
          percentChange24h: coinPaprikaData.quotes?.USD?.percent_change_24h,
        },
        coinGecko: {
          price: coinGeckoData.bitcoin?.usd,
          lastUpdated: coinGeckoData.bitcoin?.last_updated_at ? new Date(coinGeckoData.bitcoin.last_updated_at * 1000).toISOString() : null,
          responseTime: `${coinGeckoTime}ms`,
          endpoint: 'https://api.coingecko.com/api/v3/simple/price',
          currency: 'USD',
          percentChange24h: coinGeckoData.bitcoin?.usd_24h_change,
        },
        binance: {
          price: parseFloat(binanceData.price),
          lastUpdated: 'Real-time',
          responseTime: `${binanceTime}ms`,
          endpoint: 'https://api.binance.com/api/v3/ticker/price',
          currency: 'USDT (Tether)',
          note: 'Trading pair price, may differ slightly from USD',
        },
      },

      comparison: {
        trustWalletDisplayed: 83587.02,
        ourAppDisplayed: 82671,
        coinPaprikaLive: coinPaprikaData.quotes?.USD?.price,
        coinGeckoLive: coinGeckoData.bitcoin?.usd,
        binanceLive: parseFloat(binanceData.price),
      },

      analysis: {
        averagePrice: ((coinPaprikaData.quotes?.USD?.price + coinGeckoData.bitcoin?.usd + parseFloat(binanceData.price)) / 3).toFixed(2),
        maxDifference: Math.max(
          Math.abs(coinPaprikaData.quotes?.USD?.price - coinGeckoData.bitcoin?.usd),
          Math.abs(coinPaprikaData.quotes?.USD?.price - parseFloat(binanceData.price)),
          Math.abs(coinGeckoData.bitcoin?.usd - parseFloat(binanceData.price))
        ).toFixed(2),
        timestampDifferences: {
          coinPaprika: coinPaprikaData.last_updated,
          coinGecko: coinGeckoData.bitcoin?.last_updated_at ? new Date(coinGeckoData.bitcoin.last_updated_at * 1000).toISOString() : null,
          binance: 'Real-time spot price',
        },
      },

      findings: {
        note: 'Cryptocurrency prices vary across exchanges and APIs due to:',
        reasons: [
          '1. Different data sources (exchanges vs aggregators)',
          '2. Update frequency and caching',
          '3. Time lag between API updates',
          '4. Exchange-specific trading volumes',
          '5. Regional price variations',
        ],
        recommendation: 'Price differences of 1-2% are normal. Use real-time exchange APIs for most accurate prices.',
      },
    };

    return NextResponse.json(comparison, {
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
    }, { status: 500 });
  }
}
