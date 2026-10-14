"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";

const walletOptions = [
  {
    id: "existing",
    title: "Connect Existing Wallet",
    description: "Connect your wallet using WalletConnect or browser extension",
  },
  {
    id: "view-only",
    title: "View-Only Wallet",
    description: "Track any wallet address without connecting",
  },
  {
    id: "coming-soon",
    title: "Import Private Key",
    description: "Import using seed phrase or private key",
    disabled: false,
  },
];

export default function ConnectWalletPage() {
  const router = useRouter();
  const [showWalletConnect, setShowWalletConnect] = useState(false);

  const handleOptionSelect = (id: string) => {
    if (id === "view-only") {
      router.push("/view-only");
    } else if (id === "existing") {
      setShowWalletConnect(true);
    } else if (id === "coming-soon") {
      router.push("/import-wallet");
    }
  };

  const handleConnect = (address: string) => {
    setShowWalletConnect(false);
    router.push(`/dashboard?address=${address}`);
  };

  return (
    <div className="min-h-screen bg-[#0F1018]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#303344]">
        <button
          onClick={() => router.push('/welcome')}
          className="p-2 hover:bg-[#191C2A] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Connect Wallet</h1>
        <div className="w-10" />
      </div>

      {/* Options List */}
      <div className="px-6 py-6 space-y-4">
        {walletOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => !option.disabled && handleOptionSelect(option.id)}
            disabled={option.disabled}
            className={`w-full p-6 bg-[#191C2A] rounded-xl text-left transition-all ${
              option.disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#202437] active:scale-[0.98]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#4938F5]/10 flex items-center justify-center flex-shrink-0">
                {option.id === "existing" && (
                  <svg className="w-6 h-6 text-[#4938F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
                {option.id === "view-only" && (
                  <svg className="w-6 h-6 text-[#4938F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
                {option.id === "coming-soon" && (
                  <svg className="w-6 h-6 text-[#4938F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1">
                  {option.title}
                </h3>
                <p className="text-sm text-[#9CA3AF]">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Security Notice */}
      <div className="mx-6 mt-8 p-4 bg-[#4938F5]/10 border border-[#4938F5]/30 rounded-xl">
        <p className="text-sm text-[#9CA3AF] text-center">
          Your private keys never leave your device. Trust Vault never has access to your funds.
        </p>
      </div>

      {/* Wallet Connect Modal */}
      {showWalletConnect && (
        <WalletConnect
          onConnect={handleConnect}
          onCancel={() => setShowWalletConnect(false)}
        />
      )}
    </div>
  );
}
