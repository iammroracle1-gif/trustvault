"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onCancel: () => void;
}

export default function WalletConnect({ onConnect, onCancel }: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false);

  const handleMetaMask = async () => {
    setConnecting(true);
    try {
      // Check if MetaMask is available
      if (typeof window === "undefined") {
        alert("Please use a browser with MetaMask extension installed.");
        setConnecting(false);
        return;
      }

      if (typeof window.ethereum === "undefined") {
        alert("MetaMask not detected. Please install MetaMask browser extension.");
        setConnecting(false);
        return;
      }

      // Try to connect
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts[0]) {
          onConnect(accounts[0]);
        } else {
          alert("No accounts found. Please unlock MetaMask and try again.");
        }
      } catch (connectError: any) {
        console.error("MetaMask connection error:", connectError);
        
        // Handle user rejection
        if (connectError.code === 4001) {
          alert("Connection request was rejected. Please try again.");
        } else if (connectError.code === -32002) {
          alert("Connection request already pending. Please check MetaMask.");
        } else {
          alert("Failed to connect to MetaMask. Please try again.");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please refresh and try again.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50">
      <div className="bg-[#191C2A] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Connect Wallet</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleMetaMask}
            disabled={connecting}
            className="w-full p-4 bg-[#202437] hover:bg-[#303344] rounded-xl transition-colors flex items-center gap-4 disabled:opacity-50"
          >
            {connecting ? (
              <Loader2 className="w-8 h-8 animate-spin text-[#4938F5]" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="#F6851B"/>
                  <path d="M32.5 10L21.5 18L23.5 13L32.5 10Z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.5"/>
                  <path d="M7.5 10L18.3 18.1L16.5 13L7.5 10Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
                  <path d="M28 26.5L25 31L31.5 32.8L33.3 26.6L28 26.5Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
                  <path d="M6.7 26.6L8.5 32.8L15 31L12 26.5L6.7 26.6Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
                  <path d="M14.5 19.5L12.8 22.3L19.3 22.6L19.1 15.5L14.5 19.5Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
                  <path d="M25.5 19.5L20.8 15.4L20.7 22.6L27.2 22.3L25.5 19.5Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
                  <path d="M15 31L18.8 29.1L15.5 26.6L15 31Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
                  <path d="M21.2 29.1L25 31L24.5 26.6L21.2 29.1Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
                </svg>
              </div>
            )}
            <div className="flex-1 text-left">
              <p className="font-semibold text-base text-white">MetaMask</p>
              <p className="text-sm text-gray-400">Connect with browser extension</p>
            </div>
          </button>

          <button
            disabled
            className="w-full p-4 bg-[#202437] rounded-xl transition-colors flex items-center gap-4 opacity-50 cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#3B99FC"/>
                <path d="M12.5 19.5C15.8 16.2 21.2 16.2 24.5 19.5L25 20L27.5 17.5L27 17C22.3 12.3 14.7 12.3 10 17L9.5 17.5L12 20L12.5 19.5Z" fill="white"/>
                <path d="M27.5 22.5L30 25L29.5 25.5C24.8 30.2 17.2 30.2 12.5 25.5L12 25L14.5 22.5L15 23C17.8 25.8 22.2 25.8 25 23L27.5 22.5Z" fill="white"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-base text-white">WalletConnect</p>
              <p className="text-sm text-gray-400">Coming soon</p>
            </div>
          </button>

          <button
            disabled
            className="w-full p-4 bg-[#202437] rounded-xl transition-colors flex items-center gap-4 opacity-50 cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#0052FF"/>
                <circle cx="20" cy="20" r="12" fill="white"/>
                <path d="M20 13C16.1 13 13 16.1 13 20C13 23.9 16.1 27 20 27C23.9 27 27 23.9 27 20C27 16.1 23.9 13 20 13ZM22 21H21V22C21 22.6 20.6 23 20 23C19.4 23 19 22.6 19 22V21H18C17.4 21 17 20.6 17 20C17 19.4 17.4 19 18 19H19V18C19 17.4 19.4 17 20 17C20.6 17 21 17.4 21 18V19H22C22.6 19 23 19.4 23 20C23 20.6 22.6 21 22 21Z" fill="#0052FF"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-base text-white">Coinbase Wallet</p>
              <p className="text-sm text-gray-400">Coming soon</p>
            </div>
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          By connecting, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
