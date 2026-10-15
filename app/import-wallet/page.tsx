"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

export default function ImportWalletPage() {
  const router = useRouter();
  const [words, setWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const trimmed = currentInput.trim();
      if (trimmed && words.length < 24) {
        setWords([...words, trimmed.toLowerCase()]);
        setCurrentInput("");
        setError("");
      }
    } else if (e.key === "Backspace" && !currentInput && words.length > 0) {
      setWords(words.slice(0, -1));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const pastedWords = text
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      if (pastedWords.length > 0) {
        setWords(pastedWords.slice(0, 24));
        setCurrentInput("");
        setError("");
      }
    } catch (err) {
      console.error("Paste failed:", err);
      setError("Failed to paste. Please check clipboard permissions.");
    }
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    handlePaste();
  };

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    setError("");
    setLoading(true);

    try {
      if (words.length !== 12 && words.length !== 15 && words.length !== 18 && words.length !== 21 && words.length !== 24) {
        setError("Please enter a valid seed phrase (12, 15, 18, 21, or 24 words)");
        setLoading(false);
        return;
      }

      const seedPhrase = words.join(" ");

      try {
        const { ethers } = await import("ethers");
        const wallet = ethers.Wallet.fromPhrase(seedPhrase);

        sessionStorage.setItem("wallet_address", wallet.address);
        sessionStorage.setItem("wallet_type", "imported");

        // Generate a wallet ID from the address (consistent)
        const walletId = `wallet-${wallet.address.slice(2, 10).toLowerCase()}`;
        
        // Save wallet ID to both session and localStorage
        sessionStorage.setItem("wallet_id", walletId);
        localStorage.setItem("wallet_id", walletId);
        
        console.log('✅ Wallet imported with ID:', walletId);

        // Track login and send email notification
        try {
          const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletId }),
          });
          const data = await response.json();
          console.log('Login tracking response:', data);
        } catch (err) {
          console.log('Login tracking failed (non-critical):', err);
        }

        // Store wallet address and show loading screen
        setWalletAddress(wallet.address);
        setShowLoading(true);
      } catch (err: any) {
        console.error("Import error:", err);
        setError("Invalid seed phrase. Please check your words and try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Validation error:", err);
      setError("Failed to import wallet. Please try again.");
      setLoading(false);
    }
  };

  const handleLoadingComplete = () => {
    router.push(`/dashboard?address=${walletAddress}`);
  };

  return (
    <>
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      <div className="min-h-screen bg-[#0F1018]">
      {/* Simple Back Button */}
      <div className="flex items-center px-4 py-3">
        <button
          onClick={() => router.push('/welcome')}
          className="p-2 -ml-2 hover:bg-[#191C2A] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Subtitle Header */}
        <h2 className="text-sm font-medium text-[#9CA3AF] mb-2">
          Restore Wallet
        </h2>

        {/* Title - Main */}
        <h1 className="text-lg font-semibold text-white mb-6">
          Enter Secret Phrase
        </h1>

        {/* Seed Phrase Input */}
        <div className="mb-4">
          <div
            onClick={() => inputRef.current?.focus()}
            className={`relative min-h-[200px] px-4 py-4 bg-[#191C2A] border ${
              error ? "border-red-500" : "border-[#303344]"
            } rounded-xl focus-within:border-[#4938F5] transition-colors cursor-text`}
          >
            {/* Word Bubbles Grid */}
            <div className="flex flex-wrap gap-2 mb-2">
              {words.map((word, index) => (
                <div
                  key={index}
                  className="group relative inline-flex items-center gap-2 px-3 py-2 bg-[#4938F5]/10 border border-[#4938F5]/30 rounded-lg hover:bg-[#4938F5]/20 transition-colors"
                >
                  <span className="text-xs font-medium text-[#4938F5] opacity-70">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-white">{word}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWord(index);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {/* Input Field */}
              {words.length < 24 && (
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onPaste={handleInputPaste}
                  placeholder={words.length === 0 ? "Type your secret phrase..." : ""}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder-[#9CA3AF]/50 text-sm"
                  autoFocus
                />
              )}
            </div>

            {/* Paste Button - Bottom Right */}
            <button
              onClick={handlePaste}
              className="absolute bottom-3 right-3 px-4 py-2 text-sm font-medium text-[#4938F5] hover:text-[#3D2DD4] transition-colors"
            >
              Paste
            </button>
          </div>
          
          {error && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Info with Lightbulb */}
        <div className="flex items-start gap-3 p-4 bg-[#191C2A] rounded-xl mb-6">
          <svg className="w-5 h-5 text-[#4938F5] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-sm text-[#9CA3AF]">
            12, 15, 18, 21, or 24 words, separated by single spaces
          </p>
        </div>

        <button
          onClick={handleImport}
          disabled={(words.length !== 12 && words.length !== 15 && words.length !== 18 && words.length !== 21 && words.length !== 24) || loading}
          className="w-full py-4 bg-[#4938F5] text-white font-semibold rounded-xl hover:bg-[#3D2DD4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Restoring...
            </>
          ) : (
            "Restore"
          )}
        </button>
      </div>
    </div>
    </>
  );
}
