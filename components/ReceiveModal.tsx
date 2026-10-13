"use client";

import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface ReceiveModalProps {
  address: string;
  onClose: () => void;
}

export default function ReceiveModal({ address, onClose }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50">
      <div className="bg-[#191C2A] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Receive</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl mb-6">
          <QRCodeSVG
            value={address}
            size={256}
            level="H"
            includeMargin={false}
            className="w-full h-auto"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Your Wallet Address</p>
          <div className="flex items-center gap-2 p-3 bg-[#202437] rounded-xl">
            <p className="flex-1 text-white font-mono text-sm break-all">
              {address}
            </p>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-[#303344] rounded-lg transition-colors flex-shrink-0"
            >
              {copied ? (
                <Check className="w-5 h-5 text-[#75F59A]" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#4938F5]/10 border border-[#4938F5]/30 rounded-xl">
          <p className="text-sm text-gray-400 text-center">
            Only send <span className="text-white font-semibold">Ethereum (ETH)</span> and{" "}
            <span className="text-white font-semibold">ERC-20 tokens</span> to this address
          </p>
        </div>
      </div>
    </div>
  );
}
