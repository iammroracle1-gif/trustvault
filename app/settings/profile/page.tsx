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
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // Load wallets
    const saved = localStorage.getItem("vaultora_wallets");
    if (saved) {
      try {
        setWallets(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading wallets:", error);
      }
    }

    // Load registered email
    const userEmail = localStorage.getItem("wallet_email") || sessionStorage.getItem("wallet_email");
    if (userEmail) {
      setEmail(userEmail);
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
      <div className="sticky top-0 bg-[#0F1018]/95 backdrop-blur-xl z-10 border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => router.push('/settings')}
            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-all active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold text-white tracking-tight">
            Profile
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Active Wallet Card */}
      {activeWallet && (
        <div className="p-6">
          <div className="bg-gradient-to-br from-[#4938F5] to-[#7D7AFF] rounded-[28px] p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-[18px] flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: activeWallet.color }}
                >
                  <div className="w-7 h-7 text-white">
                    {WalletIcons[activeWallet.icon as keyof typeof WalletIcons] || WalletIcons.wallet}
                  </div>
                </div>
                <div>
                  <h2 className="text-[22px] font-bold text-white leading-tight">
                    {activeWallet.name}
                  </h2>
                  <p className="text-white/60 text-[13px] mt-0.5">Active Wallet</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors active:scale-95"
              >
                <Edit2 className="w-[18px] h-[18px] text-white" />
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-[18px] p-4 mb-3">
              <p className="text-white/60 text-[11px] uppercase tracking-wider mb-2 font-semibold">Email Address</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-white text-[15px] tracking-tight">
                  {email || "No email registered"}
                </p>
                {email && (
                  <button
                    onClick={() => copyAddress(email, "email")}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
                  >
                    {copiedId === "email" ? (
                      <Check className="w-[18px] h-[18px] text-[#34C759]" strokeWidth={2.5} />
                    ) : (
                      <Copy className="w-[18px] h-[18px] text-white" strokeWidth={2} />
                    )}
                  </button>
                )}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-[18px] p-4">
              <p className="text-white/60 text-[11px] uppercase tracking-wider mb-2 font-semibold">Wallet Address</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-white font-mono text-[13px] tracking-tight">
                  {sessionStorage.getItem("wallet_address")?.slice(0, 10)}...
                  {sessionStorage.getItem("wallet_address")?.slice(-8)}
                </p>
                <button
                  onClick={() => copyAddress(sessionStorage.getItem("wallet_address") || "", activeWallet.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
                >
                  {copiedId === activeWallet.id ? (
                    <Check className="w-[18px] h-[18px] text-[#34C759]" strokeWidth={2.5} />
                  ) : (
                    <Copy className="w-[18px] h-[18px] text-white" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Wallets Section */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider">
            All Wallets
          </h3>
          <button
            onClick={() => router.push("/customize-wallet")}
            className="text-[15px] text-white font-semibold hover:opacity-70 transition-opacity active:scale-95"
          >
            + Add
          </button>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`p-4 rounded-[20px] transition-all ${
                wallet.isActive
                  ? "bg-[#4938F5]/10 border-2 border-[#4938F5]"
                  : "bg-[#1C1C1E] border-2 border-transparent hover:border-[#303344]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: wallet.color }}
                >
                  <div className="w-6 h-6 text-white">
                    {WalletIcons[wallet.icon as keyof typeof WalletIcons] || WalletIcons.wallet}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-[15px] leading-tight">
                    {wallet.name}
                  </h4>
                  {wallet.isActive && (
                    <p className="text-[#4938F5] text-[13px] font-medium mt-0.5">Active</p>
                  )}
                </div>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors active:scale-95"
                >
                  <Edit2 className="w-[18px] h-[18px] text-[#8E8E93]" strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="px-6 pb-6">
        <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/settings/security/backup")}
            className="p-4 bg-[#1C1C1E] hover:bg-[#252525] rounded-[20px] transition-all active:scale-[0.98]"
          >
            <div className="w-11 h-11 bg-[#FF9500]/20 rounded-[14px] flex items-center justify-center mb-3">
              <Key className="w-5 h-5 text-[#FF9500]" strokeWidth={2} />
            </div>
            <p className="text-white font-semibold text-[15px] leading-tight">Backup</p>
            <p className="text-[#8E8E93] text-[13px] mt-1 leading-tight">Save seed phrase</p>
          </button>

          <button
            onClick={() => router.push("/settings/security")}
            className="p-4 bg-[#1C1C1E] hover:bg-[#252525] rounded-[20px] transition-all active:scale-[0.98]"
          >
            <div className="w-11 h-11 bg-[#34C759]/20 rounded-[14px] flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-[#34C759]" strokeWidth={2} />
            </div>
            <p className="text-white font-semibold text-[15px] leading-tight">Security</p>
            <p className="text-[#8E8E93] text-[13px] mt-1 leading-tight">Manage security</p>
          </button>
        </div>
      </div>
    </div>
  );
}
