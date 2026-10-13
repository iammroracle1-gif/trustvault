"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, TrendingUp, TrendingDown, X, Star, Search, Menu } from "lucide-react";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { fetchMarketTickers, formatPrice, type MarketTicker } from "@/lib/market-api";

interface PerpAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  leverage: string;
  category: string;
}

const leverageMap: { [key: string]: string } = {
  'BTC': '40x',
  'ETH': '25x',
  'BNB': '20x',
  'SOL': '20x',
  'XRP': '15x',
  'ADA': '15x',
  'DOGE': '10x',
  'MATIC': '10x',
  'DOT': '10x',
  'AVAX': '10x',
};

const categories = [
  { id: "popular", name: "Popular" },
  { id: "new", name: "New" },
  { id: "stocks", name: "Stocks" },
  { id: "cryptos", name: "Crypto" },
  { id: "pre-ipo", name: "Pre-IPO" },
  { id: "commodities", name: "Commodities" },
  { id: "fx", name: "FX" },
  { id: "defi", name: "DeFi" },
  { id: "nft", name: "NFT" },
  { id: "gaming", name: "Gaming" },
];

export default function PerpsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [showLongPage, setShowLongPage] = useState(false);
  const [showShortPage, setShowShortPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [perpAssets, setPerpAssets] = useState<PerpAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentAssets, setRecentAssets] = useState<PerpAsset[]>([]);

  useEffect(() => {
    loadPerpData();
    loadRecentActivity();
  }, []);

  const loadRecentActivity = () => {
    try {
      const recent = localStorage.getItem('recentPerpAssets');
      if (recent) {
        setRecentAssets(JSON.parse(recent));
      }
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    }
  };

  const saveToRecent = (asset: PerpAsset) => {
    try {
      let recent = recentAssets.filter(a => a.id !== asset.id);
      recent.unshift(asset);
      recent = recent.slice(0, 5); // Keep only 5 most recent
      setRecentAssets(recent);
      localStorage.setItem('recentPerpAssets', JSON.stringify(recent));
    } catch (error) {
      console.error('Failed to save recent activity:', error);
    }
  };

  const loadPerpData = async () => {
    setLoading(true);
    try {
      const response = await fetchMarketTickers(1, 30); // Get top 30 cryptos
      
      if (response.success) {
        // Transform market data to perp assets
        const assets: PerpAsset[] = response.data.map((ticker, index) => ({
          id: ticker.id,
          symbol: ticker.symbol,
          name: ticker.name,
          price: ticker.price,
          change24h: ticker.percentChange24h,
          volume: formatVolume(ticker.volume24h),
          leverage: leverageMap[ticker.symbol] || '10x',
          category: index < 10 ? 'popular' : index < 15 ? 'new' : 'cryptos',
        }));
        
        setPerpAssets(assets);
      }
    } catch (error) {
      console.error('Failed to load perp data:', error);
    }
    setLoading(false);
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(0)}M`;
    return `$${(volume / 1e3).toFixed(0)}K`;
  };

  const filteredAssets = perpAssets.filter(
    (asset) => selectedCategory === "all" || asset.category === selectedCategory
  );

  // Search filter
  const searchFilteredAssets = filteredAssets.filter((asset) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      asset.symbol.toLowerCase().includes(query) ||
      asset.name.toLowerCase().includes(query)
    );
  });

  const openTradePage = (asset: PerpAsset, type: 'long' | 'short') => {
    saveToRecent(asset); // Save to recent activity
    router.push(`/perps/trade?symbol=${asset.symbol}&type=${type}`);
  };

  // Show Long/Short selection page
  if (showLongPage || showShortPage) {
    return (
      <div className="min-h-screen bg-[#0F1018]">
        <TopNav title={showLongPage ? "Long" : "Short"} showBack onBack={() => { setShowLongPage(false); setShowShortPage(false); }} />
        
        {/* Recents */}
        {recentAssets.length > 0 && (
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-[15px] font-semibold">Recents</h3>
              <button 
                onClick={() => {
                  setRecentAssets([]);
                  localStorage.removeItem('recentPerpAssets');
                }}
                className="text-[#4938F5] text-[13px]"
              >
                Clear all
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {recentAssets.map((asset) => (
                <div 
                  key={asset.id}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-[#1C1C1E] rounded-xl"
                >
                  <div className="w-5 h-5 rounded-full bg-[#4938F5]/20 flex items-center justify-center">
                    <span className="text-[#4938F5] font-bold text-[11px]">
                      {asset.symbol.charAt(0)}
                    </span>
                  </div>
                  <span className="text-white text-[13px] font-medium">{asset.symbol}</span>
                  <span className="text-[#8E8E93] text-[11px]">Perps</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs - Modern iOS Style with Invisible Scroll */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button className="flex-shrink-0 w-9 h-8 flex items-center justify-center bg-[#1C1C1E] rounded-lg hover:bg-[#2C2C2E] transition-colors">
              <Star className="w-4 h-4 text-[#8E8E93]" />
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 h-8 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#4938F5] text-white'
                    : 'bg-[#1C1C1E] text-[#8E8E93] hover:bg-[#2C2C2E]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Provider & Sort */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <button className="flex items-center gap-1.5 text-[#8E8E93] text-[13px]">
            <Menu className="w-4 h-4" />
            <span>All providers</span>
            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
          </button>
          <button className="flex items-center gap-1.5 text-[#8E8E93] text-[13px]">
            <span>Volume (24h)</span>
            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
          </button>
        </div>

        {/* Asset List */}
        <div className="px-4 pb-32">
          <div className="space-y-1.5">
            {loading ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse h-16 bg-[#1C1C1E] rounded-xl" />
                ))}
              </div>
            ) : searchFilteredAssets.length > 0 ? (
              searchFilteredAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => openTradePage(asset, showLongPage ? 'long' : 'short')}
                  className="w-full p-3 bg-[#1C1C1E] rounded-xl hover:bg-[#252525] transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://cryptologos.cc/logos/${asset.name.toLowerCase().replace(/\s+/g, '-')}-${asset.symbol.toLowerCase()}-logo.png`}
                        alt={asset.name}
                        className="w-9 h-9 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`;
                          target.onerror = () => {
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-9 h-9 rounded-full bg-[#4938F5]/20 flex items-center justify-center"><span class="text-[#4938F5] font-bold text-[15px]">${asset.symbol.charAt(0)}</span></div>`;
                            }
                          };
                        }}
                      />
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-[15px]">{asset.symbol}</span>
                          <span className="px-1.5 py-0.5 bg-[#4938F5]/20 text-[#4938F5] text-[10px] font-bold rounded">
                            {asset.leverage}
                          </span>
                        </div>
                        <span className="text-[#8E8E93] text-[12px]">{asset.volume} Vol</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <svg width="60" height="28" className="mb-0.5">
                        <path
                          d="M0,14 Q15,9 30,18 T60,9"
                          stroke={asset.change24h < 0 ? "#FF453A" : "#34C759"}
                          strokeWidth="1.5"
                          fill="none"
                        />
                      </svg>
                      <p className="text-white font-semibold text-[15px]">
                        {formatPrice(asset.price)}
                      </p>
                      <p className={`text-[12px] font-medium ${
                        asset.change24h < 0 ? "text-[#FF453A]" : "text-[#34C759]"
                      }`}>
                        {asset.change24h > 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-[#8E8E93] text-[15px]">No assets found</p>
                <p className="text-[#8E8E93] text-[13px] mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar at Bottom - Exact Same Position as App Bottom Menu */}
        <div className="fixed bottom-0 left-0 right-0 bg-transparent px-4 py-3 pointer-events-none z-50">
          <div className="flex items-center gap-2.5 max-w-md mx-auto pointer-events-auto">
            {/* Search Input with Glass Morphism */}
            <div className="flex-1 relative bg-[#2A2F3D]/80 backdrop-blur-2xl rounded-full shadow-2xl border border-white/10">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
              <input
                type="text"
                placeholder="Search market"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[52px] pl-11 pr-3 bg-transparent border-0 text-white text-[15px] placeholder-[#8E8E93] focus:outline-none"
              />
            </div>
            
            {/* Cancel Button */}
            <button
              onClick={() => { 
                setSearchQuery("");
                setShowLongPage(false); 
                setShowShortPage(false); 
              }}
              className="w-[52px] h-[52px] flex items-center justify-center bg-[#2A2F3D]/80 backdrop-blur-2xl rounded-full shadow-2xl border border-white/10 hover:bg-[#3E4454] transition-colors active:scale-90"
            >
              <X className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Perps Page
  return (
    <div className="min-h-screen bg-[#0F1018] pb-32">
      <TopNav title="Perps" />

      {/* Deposit Banner */}
      <div className="px-6 pt-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-[22px] max-w-[240px] leading-tight">
            Deposit to fund your first position
          </h2>
          <div className="text-5xl">∞</div>
        </div>
        <button className="w-full py-4 bg-[#4938F5] text-white font-bold text-[17px] rounded-2xl hover:bg-[#5D4EFF] transition-colors">
          Deposit
        </button>
      </div>

      {/* Popular Section */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-[20px]">Popular</h3>
          <ChevronRight className="w-5 h-5 text-[#8E8E93]" />
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse h-16 bg-[#1C1C1E] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {perpAssets.filter(a => a.category === 'popular').slice(0, 6).map((asset) => (
              <div key={asset.id} className="p-3 bg-[#1C1C1E] rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://cryptologos.cc/logos/${asset.name.toLowerCase().replace(/\s+/g, '-')}-${asset.symbol.toLowerCase()}-logo.png`}
                      alt={asset.name}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`;
                        target.onerror = () => {
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-10 h-10 rounded-full bg-[#4938F5]/20 flex items-center justify-center"><span class="text-[#4938F5] font-bold text-[15px]">${asset.symbol.charAt(0)}</span></div>`;
                          }
                        };
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-[15px]">{asset.symbol}</span>
                        <span className="px-2 py-0.5 bg-[#4938F5]/20 text-[#4938F5] text-[11px] font-bold rounded">
                          {asset.leverage}
                        </span>
                      </div>
                      <span className="text-[#8E8E93] text-[13px]">{asset.volume} Vol</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <svg width="60" height="30" className="mb-1">
                      <path d="M0,15 Q15,10 30,20 T60,10" stroke={asset.change24h < 0 ? "#FF453A" : "#34C759"} strokeWidth="1.5" fill="none" />
                    </svg>
                    <p className="text-white font-semibold text-[15px]">{formatPrice(asset.price)}</p>
                    <p className={`text-[13px] font-medium ${asset.change24h < 0 ? "text-[#FF453A]" : "text-[#34C759]"}`}>
                      {asset.change24h > 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Section */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-[20px]">New</h3>
          <ChevronRight className="w-5 h-5 text-[#8E8E93]" />
        </div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse h-16 bg-[#1C1C1E] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {perpAssets.filter(a => a.category === 'new').map((asset) => (
              <div key={asset.id} className="p-3 bg-[#1C1C1E] rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://cryptologos.cc/logos/${asset.name.toLowerCase().replace(/\s+/g, '-')}-${asset.symbol.toLowerCase()}-logo.png`}
                      alt={asset.name}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`;
                        target.onerror = () => {
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-10 h-10 rounded-full bg-[#4938F5]/20 flex items-center justify-center"><span class="text-[#4938F5] font-bold text-[15px]">${asset.symbol.charAt(0)}</span></div>`;
                          }
                        };
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-[15px]">{asset.symbol}</span>
                        <span className="px-2 py-0.5 bg-[#4938F5]/20 text-[#4938F5] text-[11px] font-bold rounded">{asset.leverage}</span>
                      </div>
                      <span className="text-[#8E8E93] text-[13px]">{asset.volume} Vol</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <svg width="60" height="30" className="mb-1">
                      <path d="M0,15 Q15,20 30,10 T60,20" stroke={asset.change24h < 0 ? "#FF453A" : "#34C759"} strokeWidth="1.5" fill="none" />
                    </svg>
                    <p className="text-white font-semibold text-[15px]">{formatPrice(asset.price)}</p>
                    <p className={`text-[13px] font-medium ${asset.change24h < 0 ? "text-[#FF453A]" : "text-[#34C759]"}`}>
                      {asset.change24h > 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Long/Short Buttons (Pill Shaped) */}
      <div className="fixed bottom-20 left-0 right-0 px-4 py-3">
        <div className="flex gap-3">
          <button 
            onClick={() => setShowLongPage(true)}
            className="flex-1 h-14 bg-[#34C759] text-white font-semibold text-[17px] rounded-full hover:bg-[#30B350] transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Long <TrendingUp className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowShortPage(true)}
            className="flex-1 h-14 bg-[#FF3B30] text-white font-semibold text-[17px] rounded-full hover:bg-[#E5352A] transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Short <TrendingDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
