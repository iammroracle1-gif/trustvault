"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Star, Send, ArrowDownToLine, RefreshCw, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import SendModal from "@/components/SendModal";
import ReceiveModal from "@/components/ReceiveModal";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface AssetData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  description: string;
  marketCap?: string;
  volume24h?: string;
  supply?: string;
}

function AssetDetailContent() {
  const router = useRouter();
  const params = useParams();
  const symbol = (params?.symbol as string) || 'BTC';
  
  const [timeframe, setTimeframe] = useState('1D');
  const [isFavorite, setIsFavorite] = useState(false);
  const [chartData, setChartData] = useState<number[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [assetBalance, setAssetBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const timeframes = ['15m', '1H', '4H', '1D', '1W', '1M', '1Y', 'YTD', 'AL'];

  // Enhanced asset data with detailed descriptions
  const assetInfo: Record<string, AssetData> = {
    'BTC': {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 83652.41,
      change: -89.50,
      changePct: -0.11,
      marketCap: '$1.64T',
      volume24h: '$28.5B',
      supply: '19.5M BTC',
      description: 'Bitcoin is a decentralized digital currency that operates without a central bank or single administrator. It can be sent from user to user on the peer-to-peer bitcoin network without intermediaries. Created in 2009 by an unknown person using the name Satoshi Nakamoto, Bitcoin is the first and most valuable cryptocurrency, often referred to as digital gold.',
    },
    'ETH': {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2502.41,
      change: -7.86,
      changePct: -0.31,
      marketCap: '$301B',
      volume24h: '$15.2B',
      supply: '120M ETH',
      description: 'Ethereum is a decentralized, open-source blockchain platform that enables the execution of smart contracts and decentralized applications (DApps). Launched in 2015 by Vitalik Buterin, Ethereum introduced programmable blockchain technology, allowing developers to build and deploy applications without intermediaries. ETH is used to pay for transactions and computational services on the network.',
    },
    'SOL': {
      symbol: 'SOL',
      name: 'Solana',
      price: 108.32,
      change: -3.57,
      changePct: -3.19,
      marketCap: '$51B',
      volume24h: '$2.8B',
      supply: '470M SOL',
      description: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale. Founded in 2020, Solana features fast transaction speeds (up to 65,000 TPS) and low fees through its unique Proof of History consensus mechanism. The platform has become popular for DeFi, NFTs, and Web3 applications.',
    },
    'USDT': {
      symbol: 'USDT',
      name: 'Tether',
      price: 1.00,
      change: 0.01,
      changePct: 0.01,
      marketCap: '$140B',
      volume24h: '$95B',
      supply: '140B USDT',
      description: 'Tether (USDT) is a stablecoin pegged to the US Dollar, designed to maintain a 1:1 value ratio. Launched in 2014, it provides traders and investors with a stable medium of exchange and store of value within the cryptocurrency ecosystem. USDT is widely used for trading, remittances, and as a hedge against crypto market volatility.',
    },
  };

  const asset = assetInfo[symbol] || assetInfo['ETH'];
  const isNegative = asset.changePct < 0;

  // Fetch user's real balance from database
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletId = localStorage.getItem('wallet_id');
        if (!walletId) {
          console.warn('No wallet ID found');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/user/balance?walletId=${walletId}`);
        const data = await response.json();

        if (data.success && typeof data.balance === 'number') {
          setUserBalance(data.balance);
          // Calculate asset-specific balance (for demo, assume 1% of total balance in this asset)
          setAssetBalance((data.balance * 0.01) / asset.price);
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [asset.price]);

  // Generate chart data
  useEffect(() => {
    const points = 50;
    const data: number[] = [];
    let value = asset.price;
    
    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.5) * (asset.price * 0.02);
      value += change;
      data.push(value);
    }
    
    setChartData(data);
  }, [symbol, timeframe, asset.price]);

  // Calculate chart dimensions
  const chartHeight = 280;
  const chartWidth = 400;
  const minPrice = Math.min(...chartData);
  const maxPrice = Math.max(...chartData);
  const priceRange = maxPrice - minPrice || 1;

  // Generate SVG path
  const generatePath = () => {
    if (chartData.length === 0) return '';
    
    const points = chartData.map((price, index) => {
      const x = (index / (chartData.length - 1)) * chartWidth;
      const y = chartHeight - ((price - minPrice) / priceRange) * chartHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Load favorites from localStorage
  useEffect(() => {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      const favArray = JSON.parse(favorites);
      setIsFavorite(favArray.includes(symbol));
    }
  }, [symbol]);

  const toggleFavorite = () => {
    const favorites = localStorage.getItem('favorites');
    let favArray: string[] = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorite) {
      favArray = favArray.filter(s => s !== symbol);
    } else {
      favArray.push(symbol);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favArray));
    setIsFavorite(!isFavorite);
  };

  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const assetBalanceUSD = assetBalance * asset.price;

  return (
    <div className="h-screen bg-[#F5F5F7] flex flex-col overflow-hidden">
      {/* Header with Back Button - Higher Up */}
      <div className="flex-shrink-0 px-5 pt-8 pb-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-9 h-9 flex items-center justify-center hover:bg-black/5 rounded-full transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
        </button>
      </div>

      {/* Asset Info + Favorite on Same Line */}
      <div className="flex-shrink-0 px-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={`https://cryptologos.cc/logos/${asset.name.toLowerCase()}-${asset.symbol.toLowerCase()}-logo.png`}
            alt={asset.symbol}
            className="w-11 h-11 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`;
            }}
          />
          <div>
            <h1 className="text-[16px] font-bold text-gray-900">{asset.symbol}</h1>
            <p className="text-[12px] text-gray-500">{asset.name}</p>
          </div>
        </div>
        <button
          onClick={toggleFavorite}
          className="w-9 h-9 flex items-center justify-center hover:bg-black/5 rounded-full transition-all active:scale-95"
        >
          <Star 
            className={`w-5 h-5 ${isFavorite ? 'fill-[#4938F5] text-[#4938F5]' : 'text-gray-400'}`} 
            strokeWidth={2.5} 
          />
        </button>
      </div>

      {/* Price - Right Aligned */}
      <div className="flex-shrink-0 px-6 pb-3 text-right">
        <h2 className="text-[26px] font-bold text-gray-900 leading-none">
          ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <p className={`text-[13px] font-medium mt-1 ${isNegative ? 'text-[#FF453A]' : 'text-[#34C759]'}`}>
          {isNegative ? '' : '+'}{asset.change.toFixed(2)} ({isNegative ? '' : '+'}{asset.changePct.toFixed(2)}%)
        </p>
      </div>

      {/* Chart - Full Width, Reduced Height */}
      <div className="flex-shrink-0 pb-2">
        <div className="bg-transparent relative" style={{ height: '200px' }}>
          {chartData.length > 0 && (
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isNegative ? '#FF453A' : '#34C759'} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={isNegative ? '#FF453A' : '#34C759'} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              <path
                d={`${generatePath()} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
                fill="url(#chartGradient)"
              />
              
              <path
                d={generatePath()}
                fill="none"
                stroke={isNegative ? '#FF453A' : '#34C759'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Timeframe Selector - Single Line, Smaller */}
        <div className="flex gap-1.5 mt-2 justify-center px-4">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                timeframe === tf
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Content - No Scroll Needed */}
      <div className="flex-1 flex flex-col px-6 pb-6">
        {/* Your Balance */}
        <div className="flex items-center justify-between mb-4 pt-1">
          <p className="text-[14px] text-gray-500">Your balance</p>
          <div className="text-right">
            {loading ? (
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-[15px] font-semibold text-gray-900">
                  ${assetBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-gray-500">
                  {assetBalance.toFixed(8)} {asset.symbol}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons - Light Mode Button Style */}
        <div className="flex gap-2.5 mb-4">
          <button 
            onClick={() => setShowSendModal(true)}
            className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 text-gray-700" strokeWidth={2} />
            <span className="text-[13px] font-medium text-gray-700">Send</span>
          </button>
          <button 
            onClick={() => setShowReceiveModal(true)}
            className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ArrowDownToLine className="w-4 h-4 text-gray-700" strokeWidth={2} />
            <span className="text-[13px] font-medium text-gray-700">Receive</span>
          </button>
          <button 
            onClick={() => alert('Swap feature coming soon!')}
            className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-gray-700" strokeWidth={2} />
            <span className="text-[13px] font-medium text-gray-700">Swap</span>
          </button>
        </div>

        {/* AI Summary - Compact */}
        <div className="mb-4 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-gray-900" strokeWidth={2} />
            <h3 className="text-[14px] font-bold text-gray-900">AI Summary</h3>
          </div>
          <p className="text-[12px] text-gray-600 leading-relaxed">
            {asset.description}
          </p>
        </div>

        {/* Long/Short Buttons - Always Visible */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => alert('Long position coming soon!')}
            className="py-3.5 bg-[#34C759] hover:bg-[#2DB84F] text-white text-[16px] font-semibold rounded-[24px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          >
            <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
            Long
          </button>
          <button 
            onClick={() => alert('Short position coming soon!')}
            className="py-3.5 bg-[#FF453A] hover:bg-[#E63B30] text-white text-[16px] font-semibold rounded-[24px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          >
            <TrendingDown className="w-5 h-5" strokeWidth={2.5} />
            Short
          </button>
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50">
          <SendModal 
            balance={userBalance} 
            onClose={() => setShowSendModal(false)} 
          />
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50">
          <ReceiveModal 
            address={typeof window !== 'undefined' ? localStorage.getItem('wallet_address') || '0x742d35Ec3B1B4E5C19e8Ba7a1A2c6fAd4Be4a2f' : '0x742d35Ec3B1B4E5C19e8Ba7a1A2c6fAd4Be4a2f'}
            onClose={() => setShowReceiveModal(false)} 
          />
        </div>
      )}
    </div>
  );
}

export default function AssetDetailPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#F5F5F7] flex items-center justify-center">
        <p className="text-gray-900">Loading...</p>
      </div>
    }>
      <AssetDetailContent />
    </Suspense>
  );
}
