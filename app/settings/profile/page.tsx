"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Copy, Check, Wallet, Edit2, Shield, Key } from "lucide-react";
import { WalletIcons } from "@/components/WalletIcons";

interface WalletData {
  id: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vaultora_wallets");
    if (saved) {
      try {
        setWallets(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading wallets:", error);
      }
    }
  }, []);

  const copyAddress = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeWallet = wallets.find(w => w.isActive) || wallets[0];

  return (
    <div className="min-h-screen bg-[#0F1018] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-[#0F1018] z-10 border-b border-[#303344]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-[#191C2A] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Profile</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Active Wallet Card */}
      {activeWallet && (
        <div className="px-4 py-6">
          <div className="bg-gradient-to-br from-[#4938F5] to-[#7D7AFF] rounded-3xl p-6 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: activeWallet.color }}
                >
                  <div className="w-8 h-8 text-white">
                    {WalletIcons[activeWallet.icon as keyof typeof WalletIcons] || WalletIcons.wallet}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {activeWallet.name}
                  </h2>
                  <p className="text-white/70 text-sm">Active Wallet</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/settings/wallets")}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Edit2 className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-white/70 text-xs mb-2">Wallet Address</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-white font-mono text-sm">
                  {sessionStorage.getItem("wallet_address")?.slice(0, 10)}...
                  {sessionStorage.getItem("wallet_address")?.slice(-8)}
                </p>
                <button
                  onClick={() => copyAddress(sessionStorage.getItem("wallet_address") || "", activeWallet.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copiedId === activeWallet.id ? (
                    <Check className="w-4 h-4 text-[#75F59A]" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Wallets */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wide">
            All Wallets
          </h3>
          <button
            onClick={() => router.push("/customize-wallet")}
            className="text-sm text-[#4938F5] hover:text-[#7D7AFF] font-medium"
          >
            + Add Wallet
          </button>
        </div>

        <div className="space-y-2">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`p-4 rounded-2xl transition-all ${
                wallet.isActive
                  ? "bg-[#4938F5]/10 border-2 border-[#4938F5]"
                  : "bg-[#191C2A] border-2 border-transparent hover:border-[#303344]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: wallet.color }}
                >
                  <div className="w-6 h-6 text-white">
                    {WalletIcons[wallet.icon as keyof typeof WalletIcons] || WalletIcons.wallet}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-base">
                    {wallet.name}
                  </h4>
                  {wallet.isActive && (
                    <p className="text-[#4938F5] text-xs font-medium">Active</p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/settings/wallets/${wallet.id}`)}
                  className="p-2 hover:bg-[#202437] rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-[#9CA3AF]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4">
        <h3 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/settings/security/backup")}
            className="p-4 bg-[#191C2A] hover:bg-[#202437] rounded-2xl transition-colors"
          >
            <div className="w-10 h-10 bg-[#FF9500]/20 rounded-xl flex items-center justify-center mb-3">
              <Key className="w-5 h-5 text-[#FF9500]" />
            </div>
            <p className="text-white font-semibold text-sm">Backup Wallet</p>
            <p className="text-[#9CA3AF] text-xs mt-1">Save your seed phrase</p>
          </button>

          <button
            onClick={() => router.push("/settings/security")}
            className="p-4 bg-[#191C2A] hover:bg-[#202437] rounded-2xl transition-colors"
          >
            <div className="w-10 h-10 bg-[#34C759]/20 rounded-xl flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-[#34C759]" />
            </div>
            <p className="text-white font-semibold text-sm">Security</p>
            <p className="text-[#9CA3AF] text-xs mt-1">Manage security</p>
          </button>
        </div>
      </div>
    </div>
  );
}
