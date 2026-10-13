import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache
let cache: {
  data: any[] | null;
  timestamp: number | null;
} = {
  data: null,
  timestamp: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const API_BASE_URL = 'https://api.coinpaprika.com/v1';

// Mock data fallback for when API is unreachable (development only)
const MOCK_TICKERS = [
  { id: 'btc-bitcoin', name: 'Bitcoin', symbol: 'BTC', rank: 1, price: 83587.02, volume24h: 28500000000, marketCap: 1650000000000, percentChange24h: -0.16, percentChange7d: 2.45, lastUpdated: new Date().toISOString() },
  { id: 'eth-ethereum', name: 'Ethereum', symbol: 'ETH', rank: 2, price: 2527.90, volume24h: 14200000000, marketCap: 304000000000, percentChange24h: -1.07, percentChange7d: 1.23, lastUpdated: new Date().toISOString() },
  { id: 'usdt-tether', name: 'Tether', symbol: 'USDT', rank: 3, price: 1.00, volume24h: 48000000000, marketCap: 96000000000, percentChange24h: 0.01, percentChange7d: 0.02, lastUpdated: new Date().toISOString() },
  { id: 'bnb-binance-coin', name: 'BNB', symbol: 'BNB', rank: 4, price: 308.45, volume24h: 845000000, marketCap: 46000000000, percentChange24h: -0.95, percentChange7d: 3.12, lastUpdated: new Date().toISOString() },
  { id: 'sol-solana', name: 'Solana', symbol: 'SOL', rank: 5, price: 108.43, volume24h: 2100000000, marketCap: 51000000000, percentChange24h: -3.30, percentChange7d: -2.15, lastUpdated: new Date().toISOString() },
  { id: 'usdc-usd-coin', name: 'USD Coin', symbol: 'USDC', rank: 6, price: 1.00, volume24h: 5200000000, marketCap: 32000000000, percentChange24h: 0.00, percentChange7d: 0.01, lastUpdated: new Date().toISOString() },
  { id: 'xrp-xrp', name: 'XRP', symbol: 'XRP', rank: 7, price: 0.52, volume24h: 1200000000, marketCap: 29000000000, percentChange24h: 1.15, percentChange7d: 4.32, lastUpdated: new Date().toISOString() },
  { id: 'ada-cardano', name: 'Cardano', symbol: 'ADA', rank: 8, price: 0.38, volume24h: 320000000, marketCap: 13000000000, percentChange24h: -2.10, percentChange7d: -1.45, lastUpdated: new Date().toISOString() },
  { id: 'doge-dogecoin', name: 'Dogecoin', symbol: 'DOGE', rank: 9, price: 0.083, volume24h: 780000000, marketCap: 12000000000, percentChange24h: 0.85, percentChange7d: 2.67, lastUpdated: new Date().toISOString() },
  { id: 'trx-tron', name: 'TRON', symbol: 'TRX', rank: 10, price: 0.11, volume24h: 425000000, marketCap: 9500000000, percentChange24h: -0.45, percentChange7d: 1.88, lastUpdated: new Date().toISOString() },
  { id: 'avax-avalanche', name: 'Avalanche', symbol: 'AVAX', rank: 11, price: 23.15, volume24h: 245000000, marketCap: 9200000000, percentChange24h: -4.22, percentChange7d: -3.15, lastUpdated: new Date().toISOString() },
  { id: 'link-chainlink', name: 'Chainlink', symbol: 'LINK', rank: 12, price: 14.82, volume24h: 485000000, marketCap: 8800000000, percentChange24h: 1.35, percentChange7d: 3.45, lastUpdated: new Date().toISOString() },
  { id: 'dot-polkadot', name: 'Polkadot', symbol: 'DOT', rank: 13, price: 5.92, volume24h: 185000000, marketCap: 8100000000, percentChange24h: -1.75, percentChange7d: 0.92, lastUpdated: new Date().toISOString() },
  { id: 'matic-polygon', name: 'Polygon', symbol: 'MATIC', rank: 14, price: 0.45, volume24h: 225000000, marketCap: 7500000000, percentChange24h: -2.85, percentChange7d: -1.23, lastUpdated: new Date().toISOString() },
  { id: 'ltc-litecoin', name: 'Litecoin', symbol: 'LTC', rank: 15, price: 85.32, volume24h: 395000000, marketCap: 6400000000, percentChange24h: 0.75, percentChange7d: 2.18, lastUpdated: new Date().toISOString() },
  { id: 'uni-uniswap', name: 'Uniswap', symbol: 'UNI', rank: 16, price: 7.23, volume24h: 145000000, marketCap: 5400000000, percentChange24h: 2.14, percentChange7d: 5.67, lastUpdated: new Date().toISOString() },
  { id: 'atom-cosmos', name: 'Cosmos', symbol: 'ATOM', rank: 17, price: 8.45, volume24h: 178000000, marketCap: 3300000000, percentChange24h: -0.89, percentChange7d: 1.45, lastUpdated: new Date().toISOString() },
  { id: 'etc-ethereum-classic', name: 'Ethereum Classic', symbol: 'ETC', rank: 18, price: 21.34, volume24h: 125000000, marketCap: 3100000000, percentChange24h: -1.23, percentChange7d: -0.56, lastUpdated: new Date().toISOString() },
  { id: 'xlm-stellar', name: 'Stellar', symbol: 'XLM', rank: 19, price: 0.093, volume24h: 87000000, marketCap: 2700000000, percentChange24h: 0.45, percentChange7d: 2.89, lastUpdated: new Date().toISOString() },
  { id: 'algo-algorand', name: 'Algorand', symbol: 'ALGO', rank: 20, price: 0.17, volume24h: 92000000, marketCap: 1800000000, percentChange24h: 1.67, percentChange7d: 4.12, lastUpdated: new Date().toISOString() },
  { id: 'near-near-protocol', name: 'NEAR Protocol', symbol: 'NEAR', rank: 21, price: 5.32, volume24h: 424000000, marketCap: 5700000000, percentChange24h: -8.98, percentChange7d: -5.23, lastUpdated: new Date().toISOString() },
  { id: 'hbar-hedera', name: 'Hedera', symbol: 'HBAR', rank: 22, price: 0.067, volume24h: 67000000, marketCap: 2400000000, percentChange24h: -1.12, percentChange7d: 0.89, lastUpdated: new Date().toISOString() },
  { id: 'vet-vechain', name: 'VeChain', symbol: 'VET', rank: 23, price: 0.024, volume24h: 45000000, marketCap: 1900000000, percentChange24h: 0.98, percentChange7d: 3.45, lastUpdated: new Date().toISOString() },
  { id: 'fil-filecoin', name: 'Filecoin', symbol: 'FIL', rank: 24, price: 4.12, volume24h: 125000000, marketCap: 2100000000, percentChange24h: -2.34, percentChange7d: -1.78, lastUpdated: new Date().toISOString() },
  { id: 'icp-internet-computer', name: 'Internet Computer', symbol: 'ICP', rank: 25, price: 9.87, volume24h: 156000000, marketCap: 4500000000, percentChange24h: 1.23, percentChange7d: 6.78, lastUpdated: new Date().toISOString() },
  { id: 'apt-aptos', name: 'Aptos', symbol: 'APT', rank: 26, price: 7.89, volume24h: 234000000, marketCap: 3200000000, percentChange24h: 3.45, percentChange7d: 8.90, lastUpdated: new Date().toISOString() },
  { id: 'arb-arbitrum', name: 'Arbitrum', symbol: 'ARB', rank: 27, price: 0.89, volume24h: 345000000, marketCap: 2900000000, percentChange24h: -0.67, percentChange7d: 2.34, lastUpdated: new Date().toISOString() },
  { id: 'op-optimism', name: 'Optimism', symbol: 'OP', rank: 28, price: 1.92, volume24h: 189000000, marketCap: 1800000000, percentChange24h: 1.89, percentChange7d: 5.12, lastUpdated: new Date().toISOString() },
  { id: 'inj-injective', name: 'Injective', symbol: 'INJ', rank: 29, price: 23.45, volume24h: 234000000, marketCap: 2200000000, percentChange24h: 4.56, percentChange7d: 12.34, lastUpdated: new Date().toISOString() },
  { id: 'sui-sui', name: 'Sui', symbol: 'SUI', rank: 30, price: 2.87, volume24h: 567000000, marketCap: 7500000000, percentChange24h: 2.34, percentChange7d: 15.67, lastUpdated: new Date().toISOString() },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';

    // Check cache
    const now = Date.now();
    const isCacheValid = cache.data && cache.timestamp && (now - cache.timestamp) < CACHE_DURATION;

    let tickers: any[] = [];

    if (isCacheValid && cache.data) {
      tickers = cache.data;
      console.log('Using cached data');
    } else {
      // Fetch fresh data from CoinPaprika
      console.log('Fetching fresh data from CoinPaprika API...');
      
      try {
        const response = await fetch(`${API_BASE_URL}/tickers`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'TrustVault/1.0',
          },
        });

        if (!response.ok) {
          throw new Error(`CoinPaprika API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Transform data to our format
        tickers = data
          .filter((coin: any) => coin.quotes?.USD) // Only coins with USD price
          .map((coin: any) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            rank: coin.rank,
            price: coin.quotes.USD.price,
            volume24h: coin.quotes.USD.volume_24h,
            marketCap: coin.quotes.USD.market_cap,
            percentChange24h: coin.quotes.USD.percent_change_24h,
            percentChange7d: coin.quotes.USD.percent_change_7d,
            lastUpdated: coin.last_updated,
          }))
          .sort((a: any, b: any) => a.rank - b.rank); // Sort by rank

        // Update cache
        cache = {
          data: tickers,
          timestamp: now,
        };
      } catch (error: any) {
        console.warn('⚠️  CoinPaprika API failed, using mock data for development');
        console.error('API Error:', error.message);
        
        // Use mock data in development when API fails
        if (process.env.NODE_ENV === 'development') {
          tickers = MOCK_TICKERS;
          cache = {
            data: tickers,
            timestamp: now,
          };
        } else {
          throw error; // In production, throw the error
        }
      }
    }

    // Filter by search query
    let filteredTickers = tickers;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTickers = tickers.filter((ticker: any) => 
        ticker.name.toLowerCase().includes(searchLower) ||
        ticker.symbol.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTickers = filteredTickers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedTickers,
      pagination: {
        page,
        limit,
        total: filteredTickers.length,
        totalPages: Math.ceil(filteredTickers.length / limit),
      },
      cache: {
        cached: isCacheValid,
        lastUpdate: cache.timestamp ? new Date(cache.timestamp).toISOString() : null,
        nextUpdate: cache.timestamp ? new Date(cache.timestamp + CACHE_DURATION).toISOString() : null,
      },
      provider: 'CoinPaprika',
      apiUrl: API_BASE_URL,
    });

  } catch (error: any) {
    console.error('Market data API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch market data',
      provider: 'CoinPaprika',
      cache: {
        cached: false,
        lastUpdate: cache.timestamp ? new Date(cache.timestamp).toISOString() : null,
      },
    }, { status: 500 });
  }
}
