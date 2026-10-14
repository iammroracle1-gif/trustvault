"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search as SearchIcon, TrendingUp, TrendingDown, X } from "lucide-react";
import { fetchMarketTickers, formatPrice, type MarketTicker } from "@/lib/market-api";

export default function SearchPage() {
  const router = useRouter();
  const [cryptos, setCryptos] = useState<MarketTicker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCryptos();
  }, []);

  const loadCryptos = async () => {
    setLoading(true);
    try {
      // Fetch more cryptocurrencies for search
      const response = await fetchMarketTickers(1, 100); // Get top 100
      if (response.success) {
        setCryptos(response.data);
      }
    } catch (error) {
      console.error("Error loading cryptocurrencies:", error);
    }
    setLoading(false);
  };

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayCryptos = searchQuery ? filteredCryptos : cryptos.slice(0, 50);

  return (
    <div className="min-h-screen bg-[#0F1018] pb-24">
      {/* Header - iOS Clean */}
      <div className="sticky top-0 bg-[#0F1018]/95 backdrop-blur-xl z-10 border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          {/* Search Input - iOS Style */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#8E8E93]" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full h-9 pl-9 pr-9 bg-[#1C1C1E] rounded-[10px] text-white text-[17px] placeholder-[#8E8E93] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-[#48484A] rounded-full active:scale-90 transition-transform"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && !loading && (
        <div className="px-4 pt-4 pb-2">
          <p className="text-[13px] text-[#8E8E93] uppercase tracking-wide font-medium">
            {filteredCryptos.length} {filteredCryptos.length === 1 ? 'Result' : 'Results'}
          </p>
        </div>
      )}

      {/* Cryptocurrency List */}
      <div className="px-4">
        {loading ? (
          <div className="space-y-0 divide-y divide-white/5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-4 w-16 bg-white/5 rounded animate-pulse ml-auto" />
                    <div className="h-3 w-12 bg-white/5 rounded animate-pulse ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayCryptos.length > 0 ? (
          <div className="divide-y divide-white/5">
            {displayCryptos.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => {
                  // Navigate to crypto detail or add to wallet
                }}
                className="w-full py-3 hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Logo with fallback */}
                  <img
                    src={`https://cryptologos.cc/logos/${crypto.name.toLowerCase().replace(/\s+/g, '-')}-${crypto.symbol.toLowerCase()}-logo.png`}
                    alt={crypto.symbol}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`;
                      target.onerror = () => {
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-10 h-10 rounded-full bg-[#4938F5]/20 flex items-center justify-center"><span class="text-[#4938F5] font-bold text-[15px]">${crypto.symbol.charAt(0)}</span></div>`;
                        }
                      };
                    }}
                  />
                  
                  {/* Name and Symbol */}
                  <div className="flex-1 text-left">
                    <p className="text-white text-[17px] font-medium leading-tight">
                      {crypto.name}
                    </p>
                    <p className="text-[#8E8E93] text-[15px] mt-0.5">
                      {crypto.symbol.toUpperCase()}
                    </p>
                  </div>

                  {/* Price and Change */}
                  <div className="text-right">
                    <p className="text-white text-[17px] font-medium leading-tight">
                      {formatPrice(crypto.price)}
                    </p>
                    {crypto.percentChange24h != null && (
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        {crypto.percentChange24h < 0 ? (
                          <TrendingDown className="w-3 h-3 text-[#FF453A]" />
                        ) : (
                          <TrendingUp className="w-3 h-3 text-[#32D74B]" />
                        )}
                        <p
                          className={`text-[15px] font-medium ${
                            crypto.percentChange24h < 0
                              ? "text-[#FF453A]"
                              : "text-[#32D74B]"
                          }`}
                        >
                          {crypto.percentChange24h > 0 ? "+" : ""}
                          {crypto.percentChange24h.toFixed(2)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-7 h-7 text-[#8E8E93]" />
            </div>
            <p className="text-white text-[17px] font-medium mb-1">No Results</p>
            <p className="text-[#8E8E93] text-[15px]">
              Try searching for a different cryptocurrency
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
