"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

export default function MyWalletIdPage() {
  const [walletId, setWalletId] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWalletId(localStorage.getItem('wallet_id') || 'Not found');
    setWalletAddress(localStorage.getItem('wallet_address') || 'Not found');
    setEmail(localStorage.getItem('wallet_email') || 'Not registered');
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0F1018] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1018] p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-2">My Wallet Info</h1>
        <p className="text-[#8E8E93] mb-8">Share this information with support to receive funds</p>

        {/* Wallet ID */}
        <div className="bg-[#1C1C1E] rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-lg font-bold">Wallet ID</h2>
            <button
              onClick={() => copyToClipboard(walletId)}
              className="p-2 bg-[#4938F5] text-white rounded-lg hover:bg-[#5D4EFF] transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-[#8E8E93] text-sm font-mono break-all bg-[#0F1018] p-4 rounded-lg">
            {walletId}
          </p>
        </div>

        {/* Wallet Address */}
        <div className="bg-[#1C1C1E] rounded-2xl p-6 mb-4">
          <h2 className="text-white text-lg font-bold mb-3">Wallet Address</h2>
          <p className="text-[#8E8E93] text-sm font-mono break-all bg-[#0F1018] p-4 rounded-lg">
            {walletAddress}
          </p>
        </div>

        {/* Email */}
        <div className="bg-[#1C1C1E] rounded-2xl p-6 mb-6">
          <h2 className="text-white text-lg font-bold mb-3">Registered Email</h2>
          <p className="text-[#8E8E93] text-sm bg-[#0F1018] p-4 rounded-lg">
            {email}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-[#4938F5]/10 border border-[#4938F5]/30 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-2">📋 How to Get Funded</h3>
          <ol className="text-[#8E8E93] text-sm space-y-2 list-decimal list-inside">
            <li>Copy your Wallet ID above</li>
            <li>Send it to admin/support</li>
            <li>Wait for admin to deposit funds</li>
            <li>Balance will update automatically</li>
          </ol>
        </div>

        {email === 'Not registered' && (
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <h3 className="text-yellow-400 font-bold mb-2">⚠️ Email Not Registered</h3>
            <p className="text-[#8E8E93] text-sm">
              You haven't registered your email yet. Register to receive email notifications when you get funded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
