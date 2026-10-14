"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { WalletIcons, walletIconKeys } from "@/components/WalletIcons";

const walletColors = [
  "#FFD60A", "#34C759", "#00C7BE", "#4A90E2", 
  "#B967FF", "#FF2D55", "#8E8E93", "#FF9500",
  "#5AC8FA", "#FF9F0A", "#AF52DE"
];

export default function CustomizeWalletPage() {
  const router = useRouter();
  const [walletName, setWalletName] = useState("Wallet 1");
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof WalletIcons>("wallet");
  const [selectedColorIndex, setSelectedColorIndex] = useState(3);
  const [showGlass, setShowGlass] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const selectedColor = walletColors[selectedColorIndex];

  useEffect(() => {
    // Check if wallet was created
    const walletAddress = sessionStorage.getItem("wallet_address");
    if (!walletAddress) {
      router.push("/welcome");
    }
  }, [router]);

  const handleContinue = () => {
    // Save wallet customization
    sessionStorage.setItem("wallet_name", walletName);
    sessionStorage.setItem("wallet_icon", selectedIcon);
    sessionStorage.setItem("wallet_color", selectedColor);
    
    // Go to email registration first, then seed phrase backup
    router.push("/register-email");
  };

  const clearName = () => {
    setWalletName("");
  };

  const findCenterColor = () => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const containerWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    
    const centerPosition = scrollLeft + (containerWidth / 2);
    const buttons = container.querySelectorAll('button');
    let closestIndex = 0;
    let minDistance = Infinity;
    
    buttons.forEach((button, index) => {
      const buttonRect = button.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const buttonCenter = buttonRect.left - containerRect.left + scrollLeft + (buttonRect.width / 2);
      const distance = Math.abs(buttonCenter - centerPosition);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    setSelectedColorIndex(closestIndex);
  };

  const handleScroll = () => {
    setShowGlass(false);
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    scrollTimeout.current = setTimeout(() => {
      findCenterColor();
      setShowGlass(true);
    }, 150);
  };

  const scrollToColor = (index: number) => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const buttons = container.querySelectorAll('button');
    const targetButton = buttons[index] as HTMLElement;
    
    if (targetButton) {
      const containerWidth = container.offsetWidth;
      const buttonRect = targetButton.getBoundingClientRect();
      const buttonLeft = targetButton.offsetLeft;
      const buttonWidth = buttonRect.width;
      
      const scrollTo = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
      container.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setTimeout(() => scrollToColor(selectedColorIndex), 100);
    
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#1C1C1E] z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4">
        <button
          onClick={() => router.push('/welcome')}
          className="p-2 -ml-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h2 className="text-lg font-semibold text-white">Name your wallet</h2>
        <div className="w-10" />
      </div>

      {/* Preview Display - How wallet will look */}
      <div className="flex-shrink-0 flex justify-center py-6">
        <div className="relative">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: selectedColor }}
          >
            <div className="w-12 h-12 text-white">
              {WalletIcons[selectedIcon]}
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Color Scroll - Snaps to center */}
      <div className="flex-shrink-0 py-4 relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: 'calc(50vw - 20px)',
            paddingRight: 'calc(50vw - 20px)',
          }}
        >
          {walletColors.map((color, index) => (
            <button
              key={color}
              onClick={() => {
                setSelectedColorIndex(index);
                scrollToColor(index);
              }}
              className="relative flex-shrink-0 snap-center w-10 h-10 flex items-center justify-center"
            >
              {selectedColorIndex === index && showGlass && (
                <div className="absolute inset-0 rounded-full bg-white/8 backdrop-blur-md border border-white/20 animate-fadeIn" />
              )}
              <div
                className="w-8 h-8 rounded-full relative z-10"
                style={{ backgroundColor: color }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name Input Field */}
      <div className="flex-shrink-0 px-6 mb-4">
        <div className="relative bg-[#2C2C2E] rounded-2xl px-4 py-3.5 flex items-center">
          <span className="text-[#8E8E93] text-sm mr-3">💎</span>
          <input
            type="text"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            className="flex-1 bg-transparent text-white text-base font-medium outline-none placeholder-[#8E8E93]"
            placeholder="Wallet name"
            maxLength={20}
          />
          {walletName && (
            <button
              onClick={clearName}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-[#8E8E93]" />
            </button>
          )}
        </div>
      </div>

      {/* Icon Grid - NO SCROLL */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <div className="grid grid-cols-6 gap-2.5 auto-rows-min">
          {walletIconKeys.map((iconKey) => (
            <button
              key={iconKey}
              onClick={() => setSelectedIcon(iconKey)}
              className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${
                selectedIcon === iconKey
                  ? "bg-[#3A3A3C]"
                  : "bg-[#2C2C2E] hover:bg-[#3A3A3C]"
              }`}
            >
              <div className={`w-5 h-5 ${
                selectedIcon === iconKey ? "text-white" : "text-[#8E8E93]"
              }`}>
                {WalletIcons[iconKey]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button - Fixed at bottom */}
      <div className="flex-shrink-0 px-6 pb-6">
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-[#5856D6] text-white font-semibold text-base rounded-xl hover:bg-[#7D7AFF] transition-colors shadow-lg"
        >
          Continue
        </button>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
