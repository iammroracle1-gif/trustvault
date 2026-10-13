/**
 * Market Data API Client
 * 
 * Provider: CoinPaprika (Free API)
 * Limits: 25,000 calls/month, Rate limit: 10 calls/sec
 * License: Free for personal and commercial use
 * Documentation: https://api.coinpaprika.com/
 */

export interface MarketTicker {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  volume24h: number;
  marketCap: number;
  percentChange24h: number;
  percentChange7d: number;
  lastUpdated: string;
}

export interface MarketResponse {
  success: boolean;
  data: MarketTicker[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  cache: {
    cached: boolean;
    lastUpdate: string | null;
    nextUpdate?: string | null;
  };
  provider: string;
  error?: string;
}

export interface CoinDetails extends MarketTicker {
  percentChange1h: number;
  percentChange30d: number;
  athPrice: number;
  athDate: string | null;
}

export interface CoinResponse {
  success: boolean;
  data?: CoinDetails;
  cache: {
    cached: boolean;
    lastUpdate: string | null;
  };
  provider: string;
  error?: string;
}

/**
 * Fetch paginated market tickers
 */
export async function fetchMarketTickers(
  page: number = 1,
  limit: number = 50,
  search: string = ''
): Promise<MarketResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await fetch(`/api/market/tickers?${params}`, {
      cache: 'no-store', // Always get fresh data from our cache
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Failed to fetch market tickers:', error);
    return {
      success: false,
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      cache: { cached: false, lastUpdate: null },
      provider: 'CoinPaprika',
      error: error.message || 'Network error',
    };
  }
}

/**
 * Fetch individual coin details
 */
export async function fetchCoinDetails(coinId: string): Promise<CoinResponse> {
  try {
    const response = await fetch(`/api/market/coin/${coinId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Failed to fetch coin details:', error);
    return {
      success: false,
      cache: { cached: false, lastUpdate: null },
      provider: 'CoinPaprika',
      error: error.message || 'Network error',
    };
  }
}

/**
 * Get popular coin IDs for CoinPaprika API
 */
export const POPULAR_COINS = {
  'BTC': 'btc-bitcoin',
  'ETH': 'eth-ethereum',
  'USDT': 'usdt-tether',
  'BNB': 'bnb-binance-coin',
  'SOL': 'sol-solana',
  'USDC': 'usdc-usd-coin',
  'XRP': 'xrp-xrp',
  'DOGE': 'doge-dogecoin',
  'ADA': 'ada-cardano',
  'TRX': 'trx-tron',
  'AVAX': 'avax-avalanche',
  'LINK': 'link-chainlink',
  'DOT': 'dot-polkadot',
  'MATIC': 'matic-polygon',
  'LTC': 'ltc-litecoin',
};

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  if (price === 0) return '$0.00';
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format large numbers (market cap, volume)
 */
export function formatLargeNumber(num: number): string {
  if (num === 0) return '$0';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

/**
 * Format percentage change
 */
export function formatPercentChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}
