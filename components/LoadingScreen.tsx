"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show for 2 seconds, then fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Complete after fade out animation
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0F1018] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        {/* Trust Wallet Logo with pulse animation */}
        <div className="flex items-center justify-center mb-6 animate-pulse">
          <Image 
            src="/trust-wallet-logo.png" 
            alt="Trust Vault Logo" 
            width={120} 
            height={120}
            className="object-contain"
            priority
          />
        </div>
        
        {/* App Name */}
        <h1 className="text-white text-2xl font-bold tracking-tight mb-4">Trust Vault</h1>
        
        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-3 border-[#4938F5]/30 border-t-[#4938F5] rounded-full animate-spin" />
        </div>
        
        {/* Loading Text */}
        <p className="text-[#8E8E93] text-sm mt-4">Signing you in...</p>
      </div>
    </div>
  );
}
