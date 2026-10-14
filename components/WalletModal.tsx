"use client";

import { X, Headphones, Settings as SettingsIcon, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { WalletIcons } from "./WalletIcons";
import { useState } from "react";

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
  onEditWallet?: (walletId: string) => void;
}

export default function WalletModal({
  wallets,
  onClose,
  onAddWallet,
  onSelectWallet,
  onEditWallet,
}: WalletModalProps) {
  const router = useRouter();
  const [showMenuId, setShowMenuId] = useState<string | null>(null);

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
                className="relative"
              >
                <div
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

                  {/* Options Menu Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenuId(showMenuId === wallet.id ? null : wallet.id);
                    }}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-[#8E8E93]" />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {showMenuId === wallet.id && (
                  <>
                    {/* Backdrop to close menu */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenuId(null)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute right-4 top-16 bg-[#2C2C2E] rounded-xl shadow-2xl overflow-hidden z-50 min-w-[180px] border border-white/10 animate-slideDown">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenuId(null);
                          onClose();
                          if (onEditWallet) onEditWallet(wallet.id);
                        }}
                        className="w-full px-4 py-3 text-left text-white text-[15px] hover:bg-[#3A3A3C] transition-colors flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Wallet
                      </button>
                      
                      <div className="h-px bg-white/10" />
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenuId(null);
                          // TODO: Add delete functionality
                          alert("Delete wallet feature coming soon");
                        }}
                        className="w-full px-4 py-3 text-left text-[#FF453A] text-[15px] hover:bg-[#3A3A3C] transition-colors flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Wallet
                      </button>
                    </div>
                  </>
                )}
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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}
