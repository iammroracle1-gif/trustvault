"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Menu, ChevronRight } from "lucide-react";

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

function TradePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol') || 'BTC';
  const type = searchParams.get('type') || 'long';
  
  const [amount, setAmount] = useState(0);
  const [leverage, setLeverage] = useState(3);
  const [sliderValue, setSliderValue] = useState(0);
  const [candleData, setCandleData] = useState<any[]>([]);
  const [chartExpanded, setChartExpanded] = useState(false);
  const [balance, setBalance] = useState(0); // Real wallet balance
  const [slideBackground, setSlideBackground] = useState('transparent');
  const [isDragging, setIsDragging] = useState(false);
  
  // Chart interaction states
  const [chartZoom, setChartZoom] = useState(1.5);
  const [chartScroll, setChartScroll] = useState(0);
  const [touchPos, setTouchPos] = useState<{x: number, y: number} | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{x: number, y: number} | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [showLeverageModal, setShowLeverageModal] = useState(false);
  const [showTPSLModal, setShowTPSLModal] = useState(false);
  const [showPayWithModal, setShowPayWithModal] = useState(false);

  const assetData: any = {
    'BTC': { name: 'Bitcoin', price: 83652, change: -89.5, changePct: -0.11, leverage: '40x' },
    'ETH': { name: 'Ethereum', price: 2527, change: -27, changePct: -1.07, leverage: '25x' },
    'SOL': { name: 'Solana', price: 108, change: -3.5, changePct: -3.30, leverage: '20x' },
  };

  const asset = assetData[symbol] || assetData['BTC'];
  const maxAmount = balance; // Maximum amount user can trade

  // Load real balance from API
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletId = localStorage.getItem('wallet_id');
        const walletAddress = localStorage.getItem('wallet_address');
        
        if (!walletId && !walletAddress) {
          console.warn('No wallet credentials found');
          return;
        }

        const query = walletId ? `walletId=${walletId}` : `wallet_address=${walletAddress}`;
        const response = await fetch(`/api/user/balance?${query}`);
        const data = await response.json();

        console.log('Balance API response:', data);

        if (data.success) {
          const balanceValue = typeof data.balance === 'string' ? parseFloat(data.balance) : data.balance;
          if (!isNaN(balanceValue)) {
            setBalance(balanceValue);
            // Also update localStorage for quick access
            localStorage.setItem('walletBalance', balanceValue.toString());
          }
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };

    fetchBalance();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generate candlestick data
  useEffect(() => {
    const candles = [];
    let price = asset.price;
    
    for (let i = 0; i < 120; i++) {
      const open = price;
      const close = open + (Math.random() - 0.5) * 800;
      const high = Math.max(open, close) + Math.random() * 300;
      const low = Math.min(open, close) - Math.random() * 300;
      const isGreen = close > open;
      
      candles.push({ open, high, low, close, isGreen });
      price = close;
    }
    
    setCandleData(candles);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // Don't allow sliding beyond balance
    if (value > maxAmount) {
      setAmount(maxAmount);
      // Snap back visually
      setTimeout(() => {
        e.target.value = maxAmount.toString();
      }, 100);
    } else {
      setAmount(value);
    }
  };

  const handleSlideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Can't slide if no amount set
    if (amount === 0 || balance === 0) {
      return;
    }
    
    const value = parseInt(e.target.value);
    setSliderValue(value);
    setIsDragging(true);
    
    // Show color fill as user drags
    if (value > 0) {
      const color = type === 'long' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 59, 48, 0.15)';
      setSlideBackground(`linear-gradient(to right, ${color} ${value}%, transparent ${value}%)`);
    } else {
      setSlideBackground('transparent');
    }
  };

  const handleSlideStart = () => {
    if (amount > 0 && balance > 0) {
      setIsDragging(true);
    }
  };

  const handleSlideEnd = () => {
    setIsDragging(false);
    
    // Can't trade with 0 balance or amount
    if (amount === 0 || balance === 0) {
      setSliderValue(0);
      setSlideBackground('transparent');
      if (balance === 0) {
        alert('Insufficient balance. Please deposit funds to trade.');
      }
      return;
    }
    
    // Need to slide at least 85% to execute
    if (sliderValue >= 85) {
      const totalSize = amount * leverage;
      
      // Deduct from balance
      const newBalance = balance - amount;
      setBalance(newBalance);
      localStorage.setItem('walletBalance', newBalance.toString());
      
      alert(`${type.toUpperCase()} position opened!\n\nAsset: ${symbol}\nAmount: $${amount.toLocaleString()}\nLeverage: ${leverage}x\nTotal Size: $${totalSize.toLocaleString()}\n\nNew Balance: $${newBalance.toLocaleString()}`);
      router.back();
    } else {
      // Smooth slide back animation
      setSliderValue(0);
      setSlideBackground('transparent');
    }
  };

  // Chart interaction handlers
  const handleChartTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 450;
      const y = ((e.touches[0].clientY - rect.top) / rect.height) * chartHeight;
      setCrosshairPos({ x, y });
    }
  };

  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 450;
    const y = ((e.clientY - rect.top) / rect.height) * chartHeight;
    setCrosshairPos({ x, y });
  };

  const handleChartLeave = () => {
    setCrosshairPos(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY * -0.002;
    const newZoom = Math.max(0.8, Math.min(3, chartZoom + delta));
    setChartZoom(newZoom);
  };

  // Calculate chart dimensions
  const chartHeight = chartExpanded ? 300 : 160;
  const baseCandles = 60; // Base number of visible candles
  const visibleCandles = Math.floor(baseCandles / chartZoom);
  const startIndex = Math.max(0, candleData.length - visibleCandles);
  const visibleData = candleData.slice(startIndex, candleData.length);
  
  const allPrices = visibleData.flatMap(c => [c.high, c.low]);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
  const priceRange = maxPrice - minPrice || 1;

  const slideColor = type === 'long' ? '#34C759' : '#FF3B30';

  // Calculate crosshair price
  let crosshairPrice = 0;
  if (crosshairPos) {
    const relativeY = (crosshairPos.y / chartHeight);
    crosshairPrice = maxPrice - (relativeY * priceRange);
  }

  return (
    <div className="h-screen bg-[#0F1018] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0F1018]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center bg-[#1C1C1E] rounded-full hover:bg-[#2C2C2E] transition-all active:scale-90"
          >
            <X className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={`https://cryptologos.cc/logos/${asset.name.toLowerCase().replace(/\s+/g, '-')}-${symbol.toLowerCase()}-logo.png`}
              alt={symbol}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;
                target.onerror = () => {
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-[14px]">₿</div>`;
                  }
                };
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-[15px]">{symbol}</span>
                <span className="px-1.5 py-0.5 bg-[#4938F5]/20 text-[#4938F5] text-[10px] font-bold rounded">
                  {asset.leverage}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold text-[17px]">${asset.price.toLocaleString()}</p>
          <p className={`text-[12px] font-medium ${asset.changePct < 0 ? 'text-[#FF453A]' : 'text-[#34C759]'}`}>
            {asset.change > 0 ? '+' : ''}{asset.change} ({asset.changePct}%)
          </p>
        </div>
      </div>

      {/* Candlestick Chart */}
      <div 
        ref={chartContainerRef}
        className={`relative px-4 flex-shrink-0 transition-all duration-300 ${chartExpanded ? 'pb-4' : ''}`}
        style={{ height: chartExpanded ? '340px' : '200px' }}
        onWheel={handleWheel}
      >
        {candleData.length > 0 ? (
          <div className="relative w-full h-full overflow-hidden rounded-lg bg-[#0F1018]">
            <svg 
              ref={chartRef}
              viewBox={`0 0 450 ${chartHeight}`}
              className="w-full h-full cursor-crosshair touch-none"
              preserveAspectRatio="xMidYMid meet"
              onMouseMove={handleChartMouseMove}
              onMouseLeave={handleChartLeave}
              onTouchMove={handleChartTouchMove}
              onTouchEnd={handleChartLeave}
            >
              {/* Grid lines with price labels */}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const y = i * (chartHeight / 5);
                const price = maxPrice - (i * priceRange / 5);
                return (
                  <g key={i}>
                    <line
                      x1="0"
                      y1={y}
                      x2="450"
                      y2={y}
                      stroke="#1C1C1E"
                      strokeWidth="0.5"
                      opacity="0.5"
                    />
                    <text
                      x="445"
                      y={y + 3}
                      fill="#8E8E93"
                      fontSize="9"
                      textAnchor="end"
                    >
                      {price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </text>
                  </g>
                );
              })}
              
              {/* Candlesticks */}
              {visibleData.map((candle, index) => {
                const candleWidth = 450 / visibleData.length;
                const x = (index / visibleData.length) * 450;
                const yHigh = chartHeight - ((candle.high - minPrice) / priceRange) * (chartHeight - 20) - 10;
                const yLow = chartHeight - ((candle.low - minPrice) / priceRange) * (chartHeight - 20) - 10;
                const yOpen = chartHeight - ((candle.open - minPrice) / priceRange) * (chartHeight - 20) - 10;
                const yClose = chartHeight - ((candle.close - minPrice) / priceRange) * (chartHeight - 20) - 10;
                const color = candle.isGreen ? '#34C759' : '#FF453A';
                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1);
                const candleDisplayWidth = Math.max(candleWidth * 0.7, 2);
                
                return (
                  <g key={index}>
                    {/* Wick */}
                    <line
                      x1={x + candleWidth / 2}
                      y1={yHigh}
                      x2={x + candleWidth / 2}
                      y2={yLow}
                      stroke={color}
                      strokeWidth="1"
                    />
                    {/* Body */}
                    <rect
                      x={x + (candleWidth - candleDisplayWidth) / 2}
                      y={bodyTop}
                      width={candleDisplayWidth}
                      height={bodyHeight}
                      fill={color}
                    />
                  </g>
                );
              })}
              
              {/* Crosshair */}
              {crosshairPos && (
                <g>
                  {/* Vertical line */}
                  <line
                    x1={crosshairPos.x}
                    y1="0"
                    x2={crosshairPos.x}
                    y2={chartHeight}
                    stroke="#8E8E93"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                  {/* Horizontal line */}
                  <line
                    x1="0"
                    y1={crosshairPos.y}
                    x2="450"
                    y2={crosshairPos.y}
                    stroke="#8E8E93"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                  {/* Price label */}
                  <g>
                    <rect
                      x="395"
                      y={crosshairPos.y - 10}
                      width="50"
                      height="18"
                      fill="#4938F5"
                      rx="3"
                    />
                    <text
                      x="420"
                      y={crosshairPos.y + 3}
                      fill="white"
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      ${(crosshairPrice / 1000).toFixed(1)}K
                    </text>
                  </g>
                </g>
              )}
              
              {/* Current price label */}
              <g>
                <rect
                  x="390"
                  y={chartHeight / 2 - 12}
                  width="55"
                  height="20"
                  fill="#4938F5"
                  rx="4"
                />
                <text
                  x="417"
                  y={chartHeight / 2 + 3}
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  ${(asset.price / 1000).toFixed(1)}K
                </text>
              </g>
            </svg>
            
            {/* Zoom indicator */}
            {chartZoom !== 1.5 && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-[#1C1C1E]/80 backdrop-blur-sm rounded text-[#8E8E93] text-[10px]">
                {chartZoom.toFixed(1)}x
              </div>
            )}
          </div>
        ) : null}
        
        {/* Expand button */}
        <button 
          onClick={() => setChartExpanded(!chartExpanded)}
          className="absolute bottom-3 left-6 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1C1C1E]/80 backdrop-blur-sm rounded-lg text-[#8E8E93] text-[12px] hover:bg-[#2C2C2E]/80 transition-all active:scale-95"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          {chartExpanded ? 'Collapse' : 'Expand'}
        </button>
        
        {/* Instructions */}
        <div className="absolute top-2 left-6 text-[10px] text-[#8E8E93]">
          Scroll to zoom • Touch to view price
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="flex-1 bg-[#0F1018] px-5 py-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-[20px]">
              Open {type === 'long' ? 'Short' : 'Long'}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[#8E8E93] text-[13px]">Market</span>
              <ChevronRight className="w-3 h-3 text-[#8E8E93]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center bg-[#1C1C1E] rounded-full">
              <Menu className="w-4 h-4 text-white" />
            </button>
            <div className="w-11 h-11 flex items-center justify-center bg-[#4938F5] rounded-full text-white font-bold text-[17px]">
              {leverage}x
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="text-center mb-3">
          <p className="text-[#4938F5] text-[42px] font-bold leading-none">${amount}</p>
          <p className="text-[#8E8E93] text-[13px] mt-1">
            Size: ${amount > 0 ? (amount * leverage).toFixed(2) : '0.00'} • Balance: ${balance.toLocaleString()}
          </p>
        </div>

        {/* Amount Slider */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={Math.max(maxAmount, 1)}
            step="50"
            value={amount}
            onChange={handleAmountChange}
            disabled={balance === 0}
            className="w-full h-1.5 bg-[#1C1C1E] rounded-full appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              cursor: balance > 0 ? 'pointer' : 'not-allowed',
              background: balance > 0 
                ? `linear-gradient(to right, #4938F5 0%, #4938F5 ${(amount / Math.max(maxAmount, 1)) * 100}%, #1C1C1E ${(amount / Math.max(maxAmount, 1)) * 100}%, #1C1C1E 100%)`
                : '#1C1C1E'
            }}
          />
          <div className="flex justify-between mt-1.5 px-1">
            {balance > 0 ? (
              <>
                <span className="text-[#8E8E93] text-[10px]">$0</span>
                <span className="text-[#8E8E93] text-[10px]">${(maxAmount / 4).toLocaleString()}</span>
                <span className="text-[#8E8E93] text-[10px]">${(maxAmount / 2).toLocaleString()}</span>
                <span className="text-[#8E8E93] text-[10px]">${((maxAmount * 3) / 4).toLocaleString()}</span>
                <span className="text-[#8E8E93] text-[10px]">${maxAmount.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-[#8E8E93] text-[10px] mx-auto">No funds available</span>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-3">
          <button 
            onClick={() => setShowLeverageModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#1C1C1E] rounded-xl hover:bg-[#252525] transition-colors active:scale-[0.98]"
          >
            <span className="text-white text-[14px]">Leverage</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-[14px]">Cross {leverage}x</span>
              <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
            </div>
          </button>

          <button 
            onClick={() => setShowTPSLModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#1C1C1E] rounded-xl hover:bg-[#252525] transition-colors active:scale-[0.98]"
          >
            <span className="text-white text-[14px]">Take profit / stop loss</span>
            <div className="flex items-center gap-2">
              <span className="text-[#8E8E93] text-[14px]">None</span>
              <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
            </div>
          </button>

          <button 
            onClick={() => setShowPayWithModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#1C1C1E] rounded-xl hover:bg-[#252525] transition-colors active:scale-[0.98]"
          >
            <span className="text-white text-[14px]">Pay with</span>
            <div className="flex items-center gap-2">
              <span className="text-[#8E8E93] text-[14px]">USDT</span>
              <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
            </div>
          </button>
        </div>

        {/* Slide to Trade */}
        <div className="relative mt-auto mb-2">
          <div 
            className="h-[52px] bg-[#1C1C1E] rounded-full flex items-center px-1.5 relative overflow-hidden"
            style={{ 
              background: isDragging && sliderValue > 0 ? slideBackground : '#1C1C1E',
              transition: isDragging ? 'none' : 'background 0.3s ease'
            }}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSlideChange}
              onMouseDown={handleSlideStart}
              onMouseUp={handleSlideEnd}
              onTouchStart={handleSlideStart}
              onTouchEnd={handleSlideEnd}
              disabled={amount === 0 || balance === 0}
              className="absolute inset-0 w-full opacity-0 z-10 disabled:cursor-not-allowed"
              style={{ cursor: amount > 0 ? 'grab' : 'not-allowed' }}
            />
            <div 
              className="absolute left-1.5 top-1.5 w-[46px] h-[46px] rounded-full shadow-lg flex items-center justify-center"
              style={{
                transform: `translateX(${(sliderValue / 100) * (typeof window !== 'undefined' ? window.innerWidth - 100 : 280)}px)`,
                backgroundColor: isDragging && sliderValue > 0 ? slideColor : 'white',
                transition: isDragging ? 'transform 0.05s linear, background-color 0.2s ease' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease'
              }}
            >
              <ChevronRight 
                className="w-5 h-5" 
                strokeWidth={3}
                style={{ 
                  color: isDragging && sliderValue > 0 ? 'white' : '#0F1018',
                  transition: 'color 0.2s ease'
                }}
              />
            </div>
            <div className="flex-1 text-center relative z-0">
              <span 
                className="text-[15px] font-medium"
                style={{
                  color: isDragging && sliderValue > 30 ? 'white' : '#8E8E93',
                  transition: 'color 0.2s ease'
                }}
              >
                {amount === 0 ? 'Enter amount first' : `Slide to ${type === 'long' ? 'Short' : 'Long'}`}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Disclosure */}
        <p className="text-[#8E8E93] text-[11px] text-center mt-2">
          Risk disclosure • 0.15% fee
        </p>
      </div>

      {/* Modals */}
      {showLeverageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" onClick={() => setShowLeverageModal(false)}>
          <div className="w-full bg-[#1C1C1E] rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-[20px] font-semibold mb-4">Select Leverage</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1, 2, 3, 5, 10, 15, 20, 25].map((lev) => (
                <button
                  key={lev}
                  onClick={() => { setLeverage(lev); setShowLeverageModal(false); }}
                  className={`py-3 rounded-xl font-medium ${leverage === lev ? 'bg-[#4938F5] text-white' : 'bg-[#2C2C2E] text-[#8E8E93]'}`}
                >
                  {lev}x
                </button>
              ))}
            </div>
            <button onClick={() => setShowLeverageModal(false)} className="w-full py-3 bg-[#2C2C2E] text-white rounded-xl">Close</button>
          </div>
        </div>
      )}

      {showTPSLModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" onClick={() => setShowTPSLModal(false)}>
          <div className="w-full bg-[#1C1C1E] rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-[20px] font-semibold mb-4">Take Profit / Stop Loss</h3>
            <p className="text-[#8E8E93] text-[14px] mb-4">Set your TP/SL to manage risk</p>
            <button onClick={() => setShowTPSLModal(false)} className="w-full py-3 bg-[#4938F5] text-white rounded-xl">Coming Soon</button>
          </div>
        </div>
      )}

      {showPayWithModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" onClick={() => setShowPayWithModal(false)}>
          <div className="w-full bg-[#1C1C1E] rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-[20px] font-semibold mb-4">Pay With</h3>
            <div className="space-y-2 mb-4">
              {['USDT', 'USDC', 'BTC', 'ETH'].map((currency) => (
                <button
                  key={currency}
                  onClick={() => setShowPayWithModal(false)}
                  className="w-full py-3 bg-[#2C2C2E] text-white rounded-xl hover:bg-[#3C3C3E] transition-colors"
                >
                  {currency}
                </button>
              ))}
            </div>
            <button onClick={() => setShowPayWithModal(false)} className="w-full py-3 bg-[#2C2C2E] text-white rounded-xl">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F1018] flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <TradePageContent />
    </Suspense>
  );
}
