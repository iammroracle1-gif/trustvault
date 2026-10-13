import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.coinpaprika.com/v1';

// Simple cache for individual coins
const coinCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for individual coins

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const coinId = params.id;
    const now = Date.now();

    // Check cache
    const cached = coinCache.get(coinId);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cached.data,
        cache: {
          cached: true,
          lastUpdate: new Date(cached.timestamp).toISOString(),
        },
        provider: 'CoinPaprika',
      });
    }

    // Fetch from API
    const response = await fetch(`${API_BASE_URL}/tickers/${coinId}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinPaprika API error: ${response.status}`);
    }

    const data = await response.json();

    const coinData = {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      rank: data.rank,
      price: data.quotes?.USD?.price || 0,
      volume24h: data.quotes?.USD?.volume_24h || 0,
      marketCap: data.quotes?.USD?.market_cap || 0,
      percentChange1h: data.quotes?.USD?.percent_change_1h || 0,
      percentChange24h: data.quotes?.USD?.percent_change_24h || 0,
      percentChange7d: data.quotes?.USD?.percent_change_7d || 0,
      percentChange30d: data.quotes?.USD?.percent_change_30d || 0,
      athPrice: data.quotes?.USD?.ath_price || 0,
      athDate: data.quotes?.USD?.ath_date || null,
      lastUpdated: data.last_updated,
    };

    // Update cache
    coinCache.set(coinId, { data: coinData, timestamp: now });

    return NextResponse.json({
      success: true,
      data: coinData,
      cache: {
        cached: false,
        lastUpdate: new Date(now).toISOString(),
      },
      provider: 'CoinPaprika',
    });

  } catch (error: any) {
    console.error('Coin data API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch coin data',
      provider: 'CoinPaprika',
    }, { status: 500 });
  }
}
