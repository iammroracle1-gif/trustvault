"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Star, Send, ArrowDownToLine, RefreshCw, Sparkles } from "lucide-react";

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
  icon: string;
  description: string;
}

function AssetDetailContent() {
  const router = useRouter();
  const params = useParams();
  const symbol = (params?.symbol as string) || 'BTC';
  
  const [timeframe, setTimeframe] = useState('1D');
  const [isFavorite, setIsFavorite] = useState(false);
  const [chartData, setChartData] = useState<number[]>([]);
  
  const timeframes = ['15m', '1H', '4H', '1D', '1W', '1M', '1Y', 'YTD', 'ALL'];

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
      icon: '₿',
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
      icon: 'Ξ',
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
      icon: '◎',
      description: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.',
    },
  };

  const asset = assetInfo[symbol] || assetInfo['BTC'];
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
  const chartHeight = 200;
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

  return (
    <div className="min-h-screen bg-[#0F1018] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-[#0F1018]/95 backdrop-blur-xl z-10 border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => router.push('/markets')}
            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-all active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 -mr-2 hover:bg-white/10 rounded-lg transition-all active:scale-95"
          >
            <Star 
              className={`w-6 h-6 ${isFavorite ? 'fill-[#FFD60A] text-[#FFD60A]' : 'text-white'}`} 
              strokeWidth={2.5} 
            />
          </button>
        </div>
      </div>

      {/* Asset Info */}
      <div className="px-6 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4938F5] to-[#7D7AFF] flex items-center justify-center text-white text-[20px] font-bold">
            {asset.icon}
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-white">{asset.symbol}</h1>
            <p className="text-[13px] text-[#8E8E93]">{asset.name}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-2">
          <h2 className="text-[34px] font-bold text-white leading-none">
            ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        <p className={`text-[15px] font-medium ${isNegative ? 'text-[#FF453A]' : 'text-[#34C759]'}`}>
          {isNegative ? '' : '+'}{asset.change.toFixed(2)} ({isNegative ? '' : '+'}{asset.changePct.toFixed(2)}%)
        </p>
      </div>

      {/* Chart */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-[#1C1C1E] rounded-[20px] p-4 overflow-hidden">
          {chartData.length > 0 && (
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-[200px]"
              preserveAspectRatio="none"
            >
              {/* Gradient fill */}
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isNegative ? '#FF453A' : '#34C759'} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={isNegative ? '#FF453A' : '#34C759'} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area under line */}
              <path
                d={`${generatePath()} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
                fill="url(#chartGradient)"
              />
              
              {/* Line */}
              <path
                d={generatePath()}
                fill="none"
                stroke={isNegative ? '#FF453A' : '#34C759'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-[#4938F5] text-white'
                  : 'bg-[#1C1C1E] text-[#8E8E93] hover:bg-[#2C2C2E]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Your Balance */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-[15px] text-[#8E8E93]">Your balance</p>
          <div className="text-right">
            <p className="text-[17px] font-semibold text-white">
              ${asset.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[13px] text-[#8E8E93]">
              {asset.balance} {asset.symbol}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => router.push('/send')}
            className="p-4 bg-[#1C1C1E] hover:bg-[#2C2C2E] rounded-[18px] transition-all active:scale-[0.98] flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Send className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-white">Send</span>
          </button>

          <button
            onClick={() => router.push('/receive')}
            className="p-4 bg-[#1C1C1E] hover:bg-[#2C2C2E] rounded-[18px] transition-all active:scale-[0.98] flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <ArrowDownToLine className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-white">Receive</span>
          </button>

          <button
            onClick={() => {}}
            className="p-4 bg-[#1C1C1E] hover:bg-[#2C2C2E] rounded-[18px] transition-all active:scale-[0.98] flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-white">Swap</span>
          </button>
        </div>
      </div>

      {/* AI Summary */}
      <div className="px-6 pb-6">
        <div className="bg-[#1C1C1E] rounded-[20px] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#4938F5]" strokeWidth={2} />
            <h3 className="text-[17px] font-semibold text-white">AI Summary</h3>
          </div>
          <p className="text-[15px] text-[#8E8E93] leading-relaxed">
            {asset.description}
          </p>
        </div>
      </div>

      {/* Buy/Sell Buttons */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {}}
            className="py-4 bg-[#34C759] hover:bg-[#30B350] text-white text-[17px] font-semibold rounded-[18px] transition-all active:scale-[0.98] shadow-lg"
          >
            Buy
          </button>
          <button
            onClick={() => {}}
            className="py-4 bg-[#FF453A] hover:bg-[#E63D32] text-white text-[17px] font-semibold rounded-[18px] transition-all active:scale-[0.98] shadow-lg"
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AssetDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0F1018] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    }>
      <AssetDetailContent />
    </Suspense>
  );
}
