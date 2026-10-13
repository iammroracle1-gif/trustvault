import { NextResponse } from "next/server";

// CoinGecko API (Free tier - Real-time prices)
const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets";

// Alternative: CoinCap API (Also free and real-time)
const COINCAP_API = "https://api.coincap.io/v2/assets";

export async function GET() {
  try {
    // Try CoinGecko first
    const url = `${COINGECKO_API}?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;
    
    console.log("📡 Fetching real-time crypto prices from CoinGecko");

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Vaultora-Wallet/1.0"
      },
      cache: 'no-store', // Always fetch fresh data, no caching
    });

    if (!response.ok) {
      console.error("❌ CoinGecko API error:", response.status);
      
      // Fallback to CoinCap API if CoinGecko fails
      console.log("🔄 Trying CoinCap API as fallback...");
      const coincapResponse = await fetch(`${COINCAP_API}?limit=100`, {
        headers: {
          Accept: "application/json",
        },
        cache: 'no-store',
      });

      if (coincapResponse.ok) {
        const coincapData = await coincapResponse.json();
        // Transform CoinCap data to match CoinGecko format
        const transformedData = coincapData.data.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol.toLowerCase(),
          name: coin.name,
          current_price: parseFloat(coin.priceUsd),
          price_change_percentage_24h: parseFloat(coin.changePercent24Hr),
          market_cap: parseFloat(coin.marketCapUsd),
          image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
        }));
        console.log(`✅ Loaded ${transformedData.length} cryptocurrencies from CoinCap`);
        return NextResponse.json(transformedData);
      }

      return NextResponse.json(
        { error: "Failed to fetch markets from all sources" },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log(`✅ Loaded ${data.length} cryptocurrencies from CoinGecko`);
    console.log(`📊 BTC Price: $${data.find((c: any) => c.symbol === 'btc')?.current_price.toLocaleString()}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error in markets API:", error);
    return NextResponse.json(
      { error: "Failed to fetch markets" },
      { status: 500 }
    );
  }
}
