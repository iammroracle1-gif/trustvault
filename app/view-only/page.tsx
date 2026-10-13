"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ViewOnlyPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      router.push(`/dashboard?address=${encodeURIComponent(address)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1018]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#303344]">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#191C2A] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-semibold text-white">View-Only Wallet</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#191C2A] rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#4938F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Track Any Wallet
          </h2>
          <p className="text-[#9CA3AF]">
            Enter any wallet address to view balances and transactions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x... or ENS name"
              className="w-full px-4 py-4 bg-[#191C2A] border border-[#303344] rounded-xl text-white placeholder-[#9CA3AF]/50 focus:outline-none focus:border-[#4938F5] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!address.trim()}
            className="w-full py-4 bg-[#4938F5] text-white font-semibold rounded-xl hover:bg-[#3D2DD4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </form>

        {/* Info Cards */}
        <div className="mt-8 space-y-3">
          <div className="p-4 bg-[#191C2A] rounded-xl flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#75F59A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-[#75F59A]" />
            </div>
            <p className="text-sm text-[#9CA3AF]">
              View balances and transaction history
            </p>
          </div>
          <div className="p-4 bg-[#191C2A] rounded-xl flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#75F59A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-[#75F59A]" />
            </div>
            <p className="text-sm text-[#9CA3AF]">
              Monitor multiple addresses
            </p>
          </div>
          <div className="p-4 bg-[#191C2A] rounded-xl flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#4938F5]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-[#4938F5]" />
            </div>
            <p className="text-sm text-[#9CA3AF]">
              View-only mode: Cannot send transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
