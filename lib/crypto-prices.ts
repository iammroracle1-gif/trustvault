// Crypto Price API Integration
// Uses CoinCap API for real-time cryptocurrency prices

export interface CryptoPrice {
  currency: string;
  name: string;
  priceUsd: number;
  changePercent24Hr: number;
  symbol: string;
}

interface CoinCapAsset {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
}

// Map our currency codes to CoinCap IDs
const COINCAP_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binance-coin',
  SOL: 'solana',
  USDT: 'tether',
};

// Cache for prices (to avoid hitting API too frequently)
let priceCache: Record<string, CryptoPrice> = {};
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Fetch current prices for all supported cryptocurrencies
 */
export async function fetchCryptoPrices(): Promise<Record<string, CryptoPrice>> {
  try {
    // Return cached prices if still fresh
    const now = Date.now();
    if (now - lastFetchTime < CACHE_DURATION && Object.keys(priceCache).length > 0) {
      return priceCache;
    }

    // Build CoinCap API URL
    const ids = Object.values(COINCAP_IDS).join(',');
    const url = `https://api.coincap.io/v2/assets?ids=${ids}`;

    console.log('🔄 Fetching crypto prices from CoinCap...');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CoinCap API error: ${response.status}`);
    }

    const data = await response.json();
    const assets: CoinCapAsset[] = data.data;

    // Transform to our format
    const prices: Record<string, CryptoPrice> = {};
    
    for (const [currency, coincapId] of Object.entries(COINCAP_IDS)) {
      const asset = assets.find(a => a.id === coincapId);
      if (asset) {
        prices[currency] = {
          currency,
          name: asset.name,
          priceUsd: parseFloat(asset.priceUsd),
          changePercent24Hr: parseFloat(asset.changePercent24Hr),
          symbol: asset.symbol,
        };
      }
    }

    // Update cache
    priceCache = prices;
    lastFetchTime = now;

    console.log('✅ Crypto prices updated:', Object.keys(prices).join(', '));
    return prices;
  } catch (error) {
    console.error('❌ Error fetching crypto prices:', error);
    
    // Return cached prices if available, otherwise return fallback
    if (Object.keys(priceCache).length > 0) {
      console.log('⚠️ Using cached prices');
      return priceCache;
    }
    
    // Fallback prices (approximate)
    return {
      BTC: { currency: 'BTC', name: 'Bitcoin', priceUsd: 83650, changePercent24Hr: 0, symbol: 'BTC' },
      ETH: { currency: 'ETH', name: 'Ethereum', priceUsd: 2500, changePercent24Hr: 0, symbol: 'ETH' },
      BNB: { currency: 'BNB', name: 'Binance Coin', priceUsd: 310, changePercent24Hr: 0, symbol: 'BNB' },
      SOL: { currency: 'SOL', name: 'Solana', priceUsd: 108, changePercent24Hr: 0, symbol: 'SOL' },
      USDT: { currency: 'USDT', name: 'Tether', priceUsd: 1, changePercent24Hr: 0, symbol: 'USDT' },
    };
  }
}

/**
 * Get price for a specific currency
 */
export async function getCryptoPrice(currency: string): Promise<number> {
  const prices = await fetchCryptoPrices();
  return prices[currency]?.priceUsd || 0;
}

/**
 * Convert crypto amount to USD
 */
export async function cryptoToUsd(currency: string, amount: number): Promise<number> {
  const price = await getCryptoPrice(currency);
  return amount * price;
}

/**
 * Convert USD to crypto amount
 */
export async function usdToCrypto(currency: string, usdAmount: number): Promise<number> {
  const price = await getCryptoPrice(currency);
  if (price === 0) return 0;
  return usdAmount / price;
}

/**
 * Format crypto amount with appropriate decimals
 */
export function formatCryptoAmount(amount: number, currency: string): string {
  if (currency === 'USDT') {
    return amount.toFixed(2);
  }
  
  // For BTC, ETH, etc., show up to 8 decimals but remove trailing zeros
  const formatted = amount.toFixed(8);
  return formatted.replace(/\.?0+$/, '');
}

/**
 * Format USD amount
 */
export function formatUsdAmount(amount: number): string {
  if (amount >= 1) {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return amount.toFixed(2);
}

/**
 * Get all supported currencies
 */
export function getSupportedCurrencies() {
  return [
    { code: 'BTC', name: 'Bitcoin', decimals: 8 },
    { code: 'ETH', name: 'Ethereum', decimals: 8 },
    { code: 'BNB', name: 'Binance Coin', decimals: 8 },
    { code: 'SOL', name: 'Solana', decimals: 8 },
    { code: 'USDT', name: 'Tether', decimals: 2 },
  ];
}
