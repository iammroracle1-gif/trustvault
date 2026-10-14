"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const onboardingPages = [
  {
    title: "Private & Secure",
    subtitle: "Your keys, your crypto. We never access your private keys.",
    color: "#4938F5",
  },
  {
    title: "Multi-Chain Support",
    subtitle: "Manage Bitcoin, Ethereum, and more from one secure place.",
    color: "#75F59A",
  },
  {
    title: "Full Transparency",
    subtitle: "Open source and audited. Know exactly how your wallet works.",
    color: "#4938F5",
  },
  {
    title: "Your Control",
    subtitle: "Non-custodial wallet. You own your assets completely.",
    color: "#75F59A",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < onboardingPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1018] flex flex-col">
      {/* Onboarding Carousel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-32 h-32 mb-12 relative">
          <svg width="128" height="128" viewBox="0 0 128 128" fill="none">
            <path
              d="M64 16L92 36V76L64 96L36 76V36L64 16Z"
              stroke={onboardingPages[currentPage].color}
              strokeWidth="3"
              fill={`${onboardingPages[currentPage].color}20`}
              className="transition-all duration-500"
            />
            <path
              d="M64 40V88M44 54L64 40L84 54M44 74L64 88L84 74"
              stroke={onboardingPages[currentPage].color}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-3">
          {onboardingPages[currentPage].title}
        </h1>
        <p className="text-[#9CA3AF] text-center text-base max-w-md mb-10">
          {onboardingPages[currentPage].subtitle}
        </p>

        {/* Page Indicators */}
        <div className="flex gap-2 mb-8">
          {onboardingPages.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? "w-8 bg-[#4938F5]"
                  : "w-2 bg-[#303344]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={async () => {
            try {
              // Create wallet and go to customize page FIRST (not seed phrase)
              const { ethers } = await import("ethers");
              const wallet = ethers.Wallet.createRandom();
              
              sessionStorage.setItem("wallet_address", wallet.address);
              sessionStorage.setItem("wallet_type", "created");
              sessionStorage.setItem("temp_mnemonic", wallet.mnemonic?.phrase || "");
              
              // Go to customize wallet FIRST
              router.push("/customize-wallet");
            } catch (error) {
              console.error("Error creating wallet:", error);
            }
          }}
          className="w-full py-3.5 bg-[#4938F5] text-white text-lg font-semibold rounded-xl hover:bg-[#3D2DD4] transition-colors"
        >
          CREATE WALLET
        </button>
        <button
          onClick={() => router.push("/import-wallet")}
          className="w-full py-3.5 bg-transparent border-2 border-[#4938F5] text-white text-lg font-semibold rounded-xl hover:bg-[#4938F5]/10 transition-colors"
        >
          IMPORT WALLET
        </button>

        <div className="flex justify-center gap-6 pt-4">
          <button
            onClick={() => router.push("/terms")}
            className="text-xs text-[#9CA3AF] hover:text-white transition-colors"
          >
            Terms of Service
          </button>
          <button
            onClick={() => router.push("/privacy")}
            className="text-xs text-[#9CA3AF] hover:text-white transition-colors"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}
