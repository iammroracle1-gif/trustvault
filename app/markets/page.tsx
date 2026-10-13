"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, RefreshCw } from "lucide-react";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { fetchMarketTickers, formatPrice, formatPercentChange, formatLargeNumber, type MarketTicker } from "@/lib/market-api";

export default function MarketsPage() {
  const router = useRouter();
  const [cryptos, setCryptos] = useState<MarketTicker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadMarkets();
  }, [page, searchQuery]);

  const loadMarkets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMarketTickers(page, 100, searchQuery); // Increased to 100
      
      if (response.success) {
        setCryptos(response.data);
        setLastUpdate(response.cache.lastUpdate);
      } else {
        setError(response.error || 'Failed to load market data');
        setCryptos([]);
      }
    } catch (error: any) {
      console.error("Error loading markets:", error);
      setError(error.message || 'Network error');
      setCryptos([]);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    setPage(1);
    loadMarkets();
  };

  return (
    <div className="min-h-screen bg-[#0F1018] pb-32">
      {/* Top Navigation with Glass Morphism */}
      <TopNav title="Markets" />

      {/* Search Bar & Status */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search cryptocurrency"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#191C2A]/60 backdrop-blur-xl border border-white/5 rounded-2xl text-white text-sm placeholder-[#9CA3AF] focus:border-[#4938F5] focus:bg-[#191C2A] focus:outline-none transition-all"
          />
        </div>
        
        {/* Last Update & Refresh */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#8E8E93]">
            {lastUpdate ? `Updated ${new Date(lastUpdate).toLocaleTimeString()}` : 'Powered by CoinPaprika'}
          </span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1 text-[#4938F5] hover:text-[#5D4EFF] disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="mx-4 mb-4 p-3 bg-[#FF453A]/10 border border-[#FF453A]/20 rounded-xl">
          <p className="text-[#FF453A] text-[13px] font-medium">{error}</p>
          <button 
            onClick={handleRefresh}
            className="text-[#4938F5] text-[13px] mt-1 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Markets List */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse h-16 bg-[#191C2A] rounded-xl" />
            ))}
          </div>
        ) : cryptos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-[17px] font-semibold mb-1">No results found</p>
            <p className="text-[#8E8E93] text-[15px]">
              {searchQuery ? 'Try a different search term' : 'Unable to load market data'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {cryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="p-3 bg-[#191C2A] rounded-xl hover:bg-[#202437] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://cryptologos.cc/logos/${crypto.name.toLowerCase().replace(/\s+/g, '-')}-${crypto.symbol.toLowerCase()}-logo.png`}
                      alt={crypto.name}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        // Fallback to CoinGecko API
                        const target = e.target as HTMLImageElement;
                        target.src = `https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`;
                        target.onerror = () => {
                          // Final fallback to letter icon
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-10 h-10 rounded-full bg-[#4938F5]/20 flex items-center justify-center"><span class="text-[#4938F5] font-bold text-[15px]">${crypto.symbol.charAt(0)}</span></div>`;
                          }
                        };
                      }}
                    />
                    <div>
                      <p className="font-semibold text-white text-[15px]">
                        {crypto.symbol}
                      </p>
                      <p className="text-[13px] text-[#8E8E93]">{crypto.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white text-[15px]">
                      {formatPrice(crypto.price)}
                    </p>
                    <p
                      className={`text-[13px] font-medium ${
                        crypto.percentChange24h > 0
                          ? "text-[#34C759]"
                          : "text-[#FF453A]"
                      }`}
                    >
                      {formatPercentChange(crypto.percentChange24h)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
