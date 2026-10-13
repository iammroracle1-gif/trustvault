"use client";

import { X, Headphones, Settings as SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { WalletIcons } from "./WalletIcons";

interface Wallet {
  id: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
}

interface WalletModalProps {
  wallets: Wallet[];
  onClose: () => void;
  onAddWallet: () => void;
  onSelectWallet: (walletId: string) => void;
}

export default function WalletModal({
  wallets,
  onClose,
  onAddWallet,
  onSelectWallet,
}: WalletModalProps) {
  const router = useRouter();

  return (
    <div 
      className="fixed inset-0 bg-[#1C1C1E] z-50 animate-fadeIn"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2C2C2E]">
          <button
            onClick={onClose}
            className="p-2 -ml-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-lg font-semibold text-white">Wallets</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Headphones className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => {
                onClose();
                router.push("/settings");
              }}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <SettingsIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Multi-coin wallets section */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <h3 className="text-sm font-medium text-[#8E8E93] mb-4">
            Multi-coin wallets
          </h3>

          {/* Wallet List */}
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="flex items-center gap-3 p-4 bg-[#2C2C2E] rounded-2xl hover:bg-[#3A3A3C] cursor-pointer transition-colors"
                onClick={() => {
                  onSelectWallet(wallet.id);
                  onClose();
                }}
              >
                {/* Active indicator */}
                <div className="flex-shrink-0">
                  {wallet.isActive ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#5856D6] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-[#5856D6]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-[#48484A]" />
                  )}
                </div>

                {/* Wallet Icon */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: wallet.color }}
                >
                  <div className="w-6 h-6 text-white">
                    {WalletIcons[wallet.icon as keyof typeof WalletIcons] || WalletIcons.wallet}
                  </div>
                </div>

                {/* Wallet Name */}
                <span className="flex-1 text-white font-medium text-base">
                  {wallet.name}
                </span>

                {/* Options Menu */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-[#8E8E93]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="6" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="18" r="1.5" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Wallet Button - Fixed at bottom */}
        <div className="px-5 py-4 border-t border-[#2C2C2E]">
          <button
            onClick={() => {
              onClose();
              onAddWallet();
            }}
            className="w-full py-3.5 bg-[#2C2C2E] text-white font-semibold text-base rounded-xl hover:bg-[#3A3A3C] transition-colors"
          >
            Add wallet
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
