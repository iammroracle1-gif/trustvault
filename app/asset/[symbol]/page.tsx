"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Star, Send, ArrowDownToLine, RefreshCw, Sparkles } from "lucide-react";
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
  balance: number;
  balanceUSD: number;
  description: string;
}

function AssetDetailContent() {
  const router = useRouter();
  const params = useParams();
  const symbol = (params?.symbol as string) || 'BTC';
  
  const [timeframe, setTimeframe] = useState('1D');
  const [isFavorite, setIsFavorite] = useState(false);
  const [chartData, setChartData] = useState<number[]>([]);
  
  const timeframes = ['15m', '1H', '4H', '1D', '1W', '1M', '1Y', 'YTD', 'AL'];

  // Mock asset data - in production, fetch from API
  const assetInfo: Record<string, AssetData> = {
    'BTC': {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 83652.41,
      change: -89.50,
      changePct: -0.11,
      balance: 0.00048532,
      balanceUSD: 40.59,
      description: 'Bitcoin is a decentralized digital currency that operates without a central bank or single administrator.',
    },
    'ETH': {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2502.41,
      change: -7.86,
      changePct: -0.31,
      balance: 0.0040785,
      balanceUSD: 10.19,
      description: 'Ethereum is a decentralized, open-source blockchain platform that enables the execution of smart contracts and decentralized applications.',
    },
    'SOL': {
      symbol: 'SOL',
      name: 'Solana',
      price: 108.32,
      change: -3.57,
      changePct: -3.19,
      balance: 0.25,
      balanceUSD: 27.08,
      description: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.',
    },
  };

  const asset = assetInfo[symbol] || assetInfo['ETH'];
  const isNegative = asset.changePct < 0;

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
  }, [symbol, timeframe]);

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

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 pt-12">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
        </button>
        <button
          onClick={toggleFavorite}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all active:scale-95"
        >
          <Star 
            className={`w-6 h-6 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} 
            strokeWidth={2.5} 
          />
        </button>
      </div>

      {/* Asset Info */}
      <div className="flex-shrink-0 px-6 pt-2 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <img
            src={`https://cryptologos.cc/logos/${asset.name.toLowerCase()}-${asset.symbol.toLowerCase()}-logo.png`}
            alt={asset.symbol}
            className="w-14 h-14 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`;
            }}
          />
          <div>
            <h1 className="text-[18px] font-bold text-gray-900">{asset.symbol}</h1>
            <p className="text-[14px] text-gray-500">{asset.name}</p>
          </div>
        </div>

        {/* Price - Right Aligned */}
        <div className="text-right">
          <h2 className="text-[28px] font-bold text-gray-900 leading-none">
            ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <p className={`text-[14px] font-medium mt-1 ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
            {isNegative ? '' : '+'}{asset.change.toFixed(2)} ({isNegative ? '' : '+'}{asset.changePct.toFixed(1)}%)
          </p>
        </div>
      </div>

      {/* Chart - Flexible but controlled */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="bg-white relative" style={{ height: '280px' }}>
          {chartData.length > 0 && (
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isNegative ? '#EF4444' : '#10B981'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isNegative ? '#EF4444' : '#10B981'} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              <path
                d={`${generatePath()} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
                fill="url(#chartGradient)"
              />
              
              <path
                d={generatePath()}
                fill="none"
                stroke={isNegative ? '#EF4444' : '#10B981'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-3 mt-4 justify-center">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
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

      {/* Bottom Section - Dark Footer with our background color */}
      <div className="flex-1 bg-[#0F1018] rounded-t-3xl px-6 pt-6 pb-6 flex flex-col">
        {/* Your Balance */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] text-[#8E8E93]">Your balance</p>
          <div className="text-right">
            <p className="text-[16px] font-semibold text-white">
              ${asset.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[12px] text-[#8E8E93]">
              {asset.balance} {asset.symbol}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button 
            onClick={() => setShowSendModal(true)}
            className="py-3 bg-[#1C1C1E] hover:bg-[#2C2C2E] rounded-xl flex flex-col items-center gap-1.5 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5 text-white" strokeWidth={2} />
            <span className="text-[13px] font-medium text-white">Send</span>
          </button>
          <button 
            onClick={() => setShowReceiveModal(true)}
            className="py-3 bg-[#1C1C1E] hover:bg-[#2C2C2E] rounded-xl flex flex-col items-center gap-1.5 active:scale-95 transition-all"
          >
            <ArrowDownToLine className="w-5 h-5 text-white" strokeWidth={2} />
            <span className="text-[13px] font-medium text-white">Receive</span>
          </button>
          <button 
            onClick={() => alert('Swap feature coming soon!')}
            className="py-3 bg-[#1C1C1E] hover:bg-[#2C2C2E] rounded-xl flex flex-col items-center gap-1.5 active:scale-95 transition-all"
          >
            <RefreshCw className="w-5 h-5 text-white" strokeWidth={2} />
            <span className="text-[13px] font-medium text-white">Swap</span>
          </button>
        </div>

        {/* AI Summary */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
            <h3 className="text-[15px] font-bold text-white">AI Summary</h3>
          </div>
          <p className="text-[13px] text-[#8E8E93] leading-relaxed line-clamp-2">
            {asset.description}
          </p>
        </div>

        {/* Buy/Sell Buttons - Push to bottom */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button 
            onClick={() => alert('Buy feature coming soon!')}
            className="py-4 bg-green-500 hover:bg-green-600 text-white text-[17px] font-semibold rounded-3xl transition-all active:scale-[0.98]"
          >
            Buy
          </button>
          <button 
            onClick={() => alert('Sell feature coming soon!')}
            className="py-4 bg-red-500 hover:bg-red-600 text-white text-[17px] font-semibold rounded-3xl transition-all active:scale-[0.98]"
          >
            Sell
          </button>
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50">
          <SendModal 
            balance={asset.balanceUSD} 
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
      <div className="h-screen bg-white flex items-center justify-center">
        <p className="text-gray-900">Loading...</p>
      </div>
    }>
      <AssetDetailContent />
    </Suspense>
  );
}
