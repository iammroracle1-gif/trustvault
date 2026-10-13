"use client";

import { useState } from "react";
import { X, ChevronRight, AlertCircle, Check } from "lucide-react";

interface SendModalProps {
  onClose: () => void;
  balance: number;
}

export default function SendModal({ onClose, balance }: SendModalProps) {
  const [step, setStep] = useState<'select' | 'amount' | 'confirm' | 'success'>('select');
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Popular assets
  const assets = [
    { symbol: 'ETH', name: 'Ethereum', balance: '0.00', icon: '⟠' },
    { symbol: 'BTC', name: 'Bitcoin', balance: '0.00', icon: '₿' },
    { symbol: 'USDT', name: 'Tether USD', balance: '0.00', icon: '$' },
    { symbol: 'BNB', name: 'BNB', balance: '0.00', icon: 'B' },
  ];

  const handleSelectAsset = (symbol: string) => {
    setSelectedAsset(symbol);
    setStep('amount');
  };

  const handleContinue = () => {
    setError('');

    // Validation
    if (!recipientAddress) {
      setError('Please enter recipient address');
      return;
    }

    if (recipientAddress.length < 20) {
      setError('Invalid address format');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > balance) {
      setError('Insufficient balance');
      return;
    }

    setStep('confirm');
  };

  const handleConfirmSend = () => {
    // Simulate transaction
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  const selectedAssetData = assets.find(a => a.symbol === selectedAsset);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1C1C1E] rounded-t-3xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-[17px] font-semibold text-white">
            {step === 'select' && 'Select Asset'}
            {step === 'amount' && 'Send'}
            {step === 'confirm' && 'Confirm'}
            {step === 'success' && 'Success'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Step 1: Select Asset */}
          {step === 'select' && (
            <div className="p-6">
              <p className="text-[#8E8E93] text-[15px] mb-4">
                Choose the asset you want to send
              </p>
              <div className="space-y-2">
                {assets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => handleSelectAsset(asset.symbol)}
                    className="w-full p-4 bg-[#2C2C2E] hover:bg-[#3A3A3C] rounded-xl transition-colors flex items-center justify-between active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4938F5]/20 rounded-full flex items-center justify-center">
                        <span className="text-[#4938F5] text-xl font-bold">{asset.icon}</span>
                      </div>
                      <div className="text-left">
                        <p className="text-white font-semibold text-[15px]">{asset.symbol}</p>
                        <p className="text-[#8E8E93] text-[13px]">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-[15px]">{asset.balance}</p>
                      <ChevronRight className="w-4 h-4 text-[#8E8E93] ml-auto mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Enter Amount & Address */}
          {step === 'amount' && (
            <div className="p-6 space-y-6">
              {/* Selected Asset */}
              <div className="p-4 bg-[#2C2C2E] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4938F5]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#4938F5] text-xl font-bold">{selectedAssetData?.icon}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-[15px]">{selectedAssetData?.symbol}</p>
                    <p className="text-[#8E8E93] text-[13px]">{selectedAssetData?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep('select')}
                  className="text-[#4938F5] text-[15px] font-medium"
                >
                  Change
                </button>
              </div>

              {/* Recipient Address */}
              <div>
                <label className="block text-white text-[13px] font-medium mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#4938F5] transition-colors text-[15px]"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-white text-[13px] font-medium mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#4938F5] transition-colors text-[15px]"
                    step="0.01"
                  />
                  <button
                    onClick={() => setAmount(balance.toString())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4938F5] text-[13px] font-medium"
                  >
                    Max
                  </button>
                </div>
                <p className="text-[#8E8E93] text-[13px] mt-2">
                  Available: ${balance.toFixed(2)}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-[#FF453A] flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <p className="text-[#FF453A] text-[13px]">{error}</p>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!recipientAddress || !amount}
                className="w-full py-4 bg-[#4938F5] text-white text-[17px] font-semibold rounded-xl hover:bg-[#3D2DD4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 3: Confirm Transaction */}
          {step === 'confirm' && (
            <div className="p-6 space-y-6">
              {/* Summary */}
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#4938F5]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#4938F5] text-3xl font-bold">{selectedAssetData?.icon}</span>
                </div>
                <p className="text-[#8E8E93] text-[15px] mb-2">You're sending</p>
                <h3 className="text-white text-[32px] font-bold mb-1">{amount} {selectedAsset}</h3>
                <p className="text-[#8E8E93] text-[15px]">≈ ${(parseFloat(amount) * 1).toFixed(2)}</p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="p-4 bg-[#2C2C2E] rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#8E8E93] text-[13px]">To</p>
                  </div>
                  <p className="text-white text-[15px] font-mono break-all">
                    {recipientAddress}
                  </p>
                </div>

                <div className="p-4 bg-[#2C2C2E] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[#8E8E93] text-[13px]">Network Fee</p>
                    <p className="text-white text-[13px]">~$0.50</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[#8E8E93] text-[13px]">Total Amount</p>
                    <p className="text-white text-[15px] font-semibold">{amount} {selectedAsset}</p>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-3 bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-xl">
                <p className="text-[#FF9500] text-[13px]">
                  Please verify the recipient address carefully. Transactions cannot be reversed.
                </p>
              </div>

              {/* Confirm Button */}
              <div className="space-y-3">
                <button
                  onClick={handleConfirmSend}
                  className="w-full py-4 bg-[#4938F5] text-white text-[17px] font-semibold rounded-xl hover:bg-[#3D2DD4] transition-colors active:scale-98"
                >
                  Confirm & Send
                </button>
                <button
                  onClick={() => setStep('amount')}
                  className="w-full py-4 bg-transparent border-2 border-white/10 text-white text-[17px] font-semibold rounded-xl hover:bg-white/5 transition-colors active:scale-98"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="p-6 py-12 text-center">
              <div className="w-20 h-20 bg-[#34C759]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-[#34C759]" strokeWidth={2.5} />
              </div>
              <h3 className="text-white text-[22px] font-bold mb-2">Transaction Sent!</h3>
              <p className="text-[#8E8E93] text-[15px] mb-6">
                Your transaction is being processed
              </p>
              <div className="p-4 bg-[#2C2C2E] rounded-xl">
                <p className="text-[#8E8E93] text-[13px] mb-1">Transaction Hash</p>
                <p className="text-white text-[13px] font-mono break-all">
                  0x{Math.random().toString(36).substring(2, 15)}...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
