"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";

export default function BackupPhrasePage() {
  const router = useRouter();
  const [mnemonic, setMnemonic] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tempMnemonic = sessionStorage.getItem("temp_mnemonic");
    if (!tempMnemonic) {
      router.push("/welcome");
      return;
    }
    setMnemonic(tempMnemonic);
    setWords(tempMnemonic.split(" "));
  }, [router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    const address = sessionStorage.getItem("wallet_address");
    sessionStorage.removeItem("temp_mnemonic");
    router.push(`/dashboard?address=${address}`);
  };

  if (!words.length) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="#F5F5F5"/>
            <path d="M12 20L18 26L28 16" stroke="#4938F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl text-center font-regular text-black mb-2">
          Write Down Your Seed Phrase
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-center text-gray-600 mb-8 px-4 leading-relaxed">
          These 12 words are the only way to restore your Trust wallet.
          <br />
          Save them somewhere safe and secret.
        </p>

        {/* Seed Phrase Display - White background with shadow */}
        <div className="relative bg-white rounded-2xl p-4 mb-4 shadow-lg border border-gray-100">
          <div className="space-y-2 mb-4">
            {words.map((word, index) => (
              <div
                key={index}
                className="flex items-center text-base"
              >
                <span className="text-gray-400 font-medium w-8 text-right mr-3">
                  {index + 1}
                </span>
                <span className="font-medium text-black">{word}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full py-3.5 bg-transparent border border-gray-300 text-black text-base font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-6"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>

        <div className="flex-1"></div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3.5 bg-[#4938F5] text-white text-base font-semibold rounded-xl hover:bg-[#3D2DD4] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
