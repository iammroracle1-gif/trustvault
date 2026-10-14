"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check, AlertCircle, Wallet, Info } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface CryptoOption {
  id: string;
  symbol: string;
  name: string;
  address: string;
  icon: string;
  network: string;
}

export default function DepositPage() {
  const router = useRouter();
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Crypto options with REAL wallet addresses
  const cryptoOptions: CryptoOption[] = [
    {
      id: "btc",
      symbol: "BTC",
      name: "Bitcoin",
      address: "bc1qvcp0tmsyj37shhk3u893x3ncq5z9xh8kldc6t6",
      icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      network: "Bitcoin Network"
    },
    {
      id: "eth",
      symbol: "ETH",
      name: "Ethereum",
      address: "0x41ad746999661215464846780D62a9f7303E248c",
      icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      network: "Ethereum (ERC-20)"
    },
    {
      id: "bnb",
      symbol: "BNB",
      name: "Binance Coin",
      address: "0x41ad746999661215464846780D62a9f7303E248c",
      icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
      network: "BNB Smart Chain"
    },
    {
      id: "sol",
      symbol: "SOL",
      name: "Solana",
      address: "9BmmKEbWsqr3Zf3vxZM7P877PYfV6rgxYr9LsRTgZCpu",
      icon: "https://cryptologos.cc/logos/solana-sol-logo.png",
      network: "Solana Network"
    },
    {
      id: "usdt",
      symbol: "USDT",
      name: "Tether USD",
      address: "0x41ad746999661215464846780D62a9f7303E248c",
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      network: "Ethereum (ERC-20)"
    }
  ];

  const handleCopyAddress = () => {
    if (selectedCrypto) {
      navigator.clipboard.writeText(selectedCrypto.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedCrypto || !amount || parseFloat(amount) <= 0) {
      alert("Please select a cryptocurrency and enter a valid amount");
      return;
    }

    setSubmitting(true);

    try {
      const walletId = localStorage.getItem("wallet_id");
      const walletEmail = localStorage.getItem("wallet_email");

      if (!walletId) {
        alert("Wallet ID not found. Please log in again.");
        setSubmitting(false);
        return;
      }

      const response = await fetch("/api/user/deposit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletId,
          email: walletEmail,
          crypto: selectedCrypto.symbol,
          amount: parseFloat(amount),
          address: selectedCrypto.address,
          network: selectedCrypto.network,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        alert(data.error || "Failed to submit deposit request");
      }
    } catch (error) {
      console.error("Deposit request error:", error);
      alert("Failed to submit deposit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1018] pb-8">
      {/* Header - Compact */}
      <div className="px-6 py-4 bg-[#191C2A] border-b border-[#303344]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-9 h-9 flex items-center justify-center hover:bg-[#202437] rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
          <h1 className="text-[17px] font-bold text-white">Deposit Funds</h1>
        </div>
      </div>

      {success ? (
        // Success Screen
        <div className="px-6 py-12 text-center">
          <div className="w-20 h-20 bg-[#34C759]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-[#34C759]" strokeWidth={2.5} />
          </div>
          <h2 className="text-[22px] font-bold text-white mb-2">Request Submitted!</h2>
          <p className="text-[15px] text-[#8E8E93] mb-6">
            Your deposit request has been sent to our admin team for verification. You'll receive an email notification once approved.
          </p>
          <div className="p-4 bg-[#191C2A] rounded-xl">
            <p className="text-[13px] text-[#8E8E93] mb-1">Requested Amount</p>
            <p className="text-[20px] font-bold text-white">${amount} USD</p>
          </div>
        </div>
      ) : (
        <>
          {/* Step 1: Select Cryptocurrency */}
          {!selectedCrypto ? (
            <div className="px-6 py-4">
              <h2 className="text-[16px] font-bold text-white mb-1">Select Cryptocurrency</h2>
              <p className="text-[13px] text-[#8E8E93] mb-4">
                Choose crypto to deposit
              </p>

              <div className="space-y-2">
                {cryptoOptions.map((crypto) => (
                  <button
                    key={crypto.id}
                    onClick={() => setSelectedCrypto(crypto)}
                    className="w-full p-3 bg-[#191C2A] hover:bg-[#202437] rounded-xl transition-all active:scale-[0.99] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.icon}
                        alt={crypto.symbol}
                        className="w-10 h-10 rounded-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                      <div className="text-left">
                        <p className="text-[15px] font-semibold text-white">{crypto.symbol}</p>
                        <p className="text-[12px] text-[#8E8E93]">{crypto.name}</p>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#8E8E93]">
                      {crypto.network}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Step 2: Deposit Instructions & Amount - COMPACT
            <div className="px-6 py-4">
              {/* Selected Crypto Info */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={selectedCrypto.icon}
                  alt={selectedCrypto.symbol}
                  className="w-11 h-11 rounded-full object-contain"
                />
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-white">{selectedCrypto.symbol}</p>
                  <p className="text-[12px] text-[#8E8E93]">{selectedCrypto.network}</p>
                </div>
                <button
                  onClick={() => setSelectedCrypto(null)}
                  className="text-[#4938F5] text-[13px] font-medium"
                >
                  Change
                </button>
              </div>

              {/* Deposit Amount Input */}
              <div className="mb-4">
                <label className="block text-white text-[14px] font-semibold mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-[#191C2A] border border-white/10 rounded-xl text-white text-[16px] placeholder-[#8E8E93] focus:outline-none focus:border-[#4938F5] transition-colors"
                  step="0.01"
                  min="0"
                />
                <p className="text-[11px] text-[#8E8E93] mt-1.5">
                  Min: $10
                </p>
              </div>

              {/* Wallet Address - Primary */}
              <div className="mb-4">
                <label className="block text-white text-[14px] font-semibold mb-2">
                  Deposit Address
                </label>
                <div className="flex items-center gap-2 p-3 bg-[#191C2A] rounded-xl border border-white/10">
                  <p className="flex-1 text-white font-mono text-[12px] break-all">
                    {selectedCrypto.address}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="p-2 hover:bg-[#202437] rounded-lg transition-colors flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[#34C759]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#8E8E93]" />
                    )}
                  </button>
                </div>
              </div>

              {/* QR Code - Smaller */}
              <div className="mb-4 bg-white p-4 rounded-xl flex justify-center">
                <QRCodeSVG
                  value={selectedCrypto.address}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* Instructions - Brief */}
              <div className="mb-4 p-3 bg-[#4938F5]/10 border border-[#4938F5]/30 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#4938F5] flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-[13px] font-semibold text-white mb-1">How to Deposit</p>
                    <p className="text-[12px] text-[#8E8E93] leading-relaxed">
                      1. Send {selectedCrypto.symbol} to the address above<br/>
                      2. Enter deposit amount in USD<br/>
                      3. Click "I Have Made Payment"<br/>
                      4. Wait for admin approval (~5-30 min)
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning - Compact */}
              <div className="mb-4 p-3 bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#FF9500] flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <p className="text-[12px] text-[#8E8E93]">
                    Only send {selectedCrypto.symbol} on {selectedCrypto.network}. Wrong network = lost funds.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitPayment}
                disabled={submitting || !amount || parseFloat(amount) < 10}
                className="w-full py-3.5 bg-[#34C759] hover:bg-[#2DB84F] text-white text-[16px] font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                    I Have Made Payment
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
