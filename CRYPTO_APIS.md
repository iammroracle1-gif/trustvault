# Real-Time Cryptocurrency Price APIs

## Currently Using (FREE)

### 1. **CoinGecko API** (Primary)
- **URL**: `https://api.coingecko.com/api/v3/coins/markets`
- **Rate Limit**: 10-50 calls/minute (free tier)
- **Pros**: Very reliable, accurate prices, no API key needed
- **Cons**: Rate limiting on free tier
- **Documentation**: https://www.coingecko.com/en/api/documentation

**Our Implementation**:
```typescript
const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;
```

### 2. **CoinCap API** (Fallback)
- **URL**: `https://api.coincap.io/v2/assets`
- **Rate Limit**: 200 requests/minute (free)
- **Pros**: Higher rate limits, real-time data, no API key
- **Cons**: Different data format (we transform it)
- **Documentation**: https://docs.coincap.io/

**Our Implementation**:
```typescript
const url = `https://api.coincap.io/v2/assets?limit=100`;
```

---

## Best FREE Alternatives for Real-Time Prices

### 3. **Binance API** (Most Real-Time)
- **URL**: `https://api.binance.com/api/v3/ticker/price`
- **Rate Limit**: 1200 requests/minute
- **Pros**: FASTEST real-time prices (direct from exchange), highest rate limits
- **Cons**: Only shows coins traded on Binance, requires mapping to USD
- **Documentation**: https://binance-docs.github.io/apidocs/spot/en/

**Example Usage**:
```typescript
// Get BTC price in USDT
const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
// Returns: { "symbol": "BTCUSDT", "price": "82671.50" }
```

### 4. **CryptoCompare API** (Good Free Tier)
- **URL**: `https://min-api.cryptocompare.com/data/pricemultifull`
- **Rate Limit**: 100,000 calls/month (free)
- **Pros**: Accurate, good free tier
- **Cons**: Requires API key (free)
- **Sign up**: https://www.cryptocompare.com/cryptopian/api-keys

### 5. **CoinMarketCap API** (Professional)
- **URL**: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`
- **Rate Limit**: 333 calls/day (free basic plan)
- **Pros**: Very accurate, professional grade
- **Cons**: Low free tier limit, requires API key
- **Sign up**: https://coinmarketcap.com/api/

---

## Why Prices Might Be Different

1. **Exchange Variations**: Bitcoin trades at slightly different prices on different exchanges
   - Binance: $82,650
   - Coinbase: $82,680
   - Kraken: $82,665

2. **Data Aggregation**: CoinGecko aggregates prices from multiple exchanges
   - Takes weighted average across 100+ exchanges
   - More stable but might lag by a few seconds

3. **API Caching**: Some APIs cache data for 10-60 seconds
   - We removed caching: `cache: 'no-store'`
   - Now fetches fresh data every request

4. **Rate Limiting**: When rate limited, APIs might return cached/stale data

---

## Recommended Setup for Production

### Option A: Use Multiple APIs (Current Setup)
```typescript
// Primary: CoinGecko (accurate, aggregated)
// Fallback: CoinCap (faster, real-time)
// This is what we're using now
```

### Option B: Use Binance for Real-Time Trading Prices
```typescript
// Best for REAL-TIME prices (millisecond updates)
// Only shows top 500 coins
// Need to convert to USD via stablecoins
```

### Option C: Get CoinMarketCap Pro API Key
```typescript
// Most accurate for market data
// Professional grade
// $0 for basic tier (333 calls/day)
```

---

## How to Test Current Implementation

1. **Check Console Logs**:
   - Server logs show: `📊 BTC Price: $82,671`
   - This confirms real-time price

2. **Compare with Live Data**:
   - CoinGecko: https://www.coingecko.com/en/coins/bitcoin
   - Binance: https://www.binance.com/en/trade/BTC_USDT
   - CoinMarketCap: https://coinmarketcap.com/currencies/bitcoin/

3. **Test API Directly**:
```bash
# CoinGecko
curl "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin"

# CoinCap
curl "https://api.coincap.io/v2/assets/bitcoin"

# Binance
curl "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
```

---

## Current Status

✅ **Removed caching** - Always fetches fresh data  
✅ **CoinGecko primary** - Most reliable free API  
✅ **CoinCap fallback** - Automatic failover  
✅ **No API key needed** - Works immediately  

**Current BTC Price in our app**: Should match CoinGecko exactly (e.g., $82,671)

If you see different prices, it's likely:
1. Your browser cached old data (hard refresh: Ctrl+Shift+R)
2. CoinGecko rate limit hit (wait 1 minute)
3. Regional price differences (CoinGecko shows global average)
