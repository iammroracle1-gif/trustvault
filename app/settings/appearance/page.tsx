"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AppearancePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0F1018]' : 'bg-[#F5F5F7]'} pb-20`}>
      {/* Header */}
      <div className={`sticky top-0 ${theme === 'dark' ? 'bg-[#0F1018]' : 'bg-[#F5F5F7]'} z-10 border-b ${theme === 'dark' ? 'border-[#303344]' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push('/settings')}
            className={`p-2 -ml-2 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'} rounded-lg transition-colors`}
          >
            <ArrowLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} strokeWidth={2.5} />
          </button>
          <h1 className={`text-[17px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Appearance</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Theme Selection */}
      <div className="px-6 py-6">
        <h2 className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-[#8E8E93]' : 'text-gray-500'} uppercase tracking-wide mb-3`}>
          Theme Mode
        </h2>
        <div className="space-y-3">
          {/* Dark Theme */}
          <button
            onClick={() => setTheme('dark')}
            className={`w-full p-4 rounded-xl transition-all flex items-center justify-between ${
              theme === 'dark'
                ? 'bg-[#4938F5]'
                : theme === 'light'
                  ? 'bg-white hover:bg-gray-100'
                  : 'bg-[#191C2A] hover:bg-[#202437]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-white/20' : 'bg-[#4938F5]/10'
              }`}>
                <Moon className={`w-5 h-5 ${
                  theme === 'dark' ? 'text-white' : 'text-[#4938F5]'
                }`} strokeWidth={2} />
              </div>
              <div className="text-left">
                <p className={`text-[15px] font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Dark Mode
                </p>
                <p className={`text-[13px] ${
                  theme === 'dark' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  Easy on the eyes
                </p>
              </div>
            </div>
            {theme === 'dark' && (
              <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
            )}
          </button>

          {/* Light Theme */}
          <button
            onClick={() => setTheme('light')}
            className={`w-full p-4 rounded-xl transition-all flex items-center justify-between ${
              theme === 'light'
                ? 'bg-[#4938F5]'
                : theme === 'dark'
                  ? 'bg-[#191C2A] hover:bg-[#202437]'
                  : 'bg-white hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                theme === 'light' ? 'bg-white/20' : 'bg-[#FF9500]/10'
              }`}>
                <Sun className={`w-5 h-5 ${
                  theme === 'light' ? 'text-white' : 'text-[#FF9500]'
                }`} strokeWidth={2} />
              </div>
              <div className="text-left">
                <p className={`text-[15px] font-semibold ${
                  theme === 'light' ? 'text-white' : 'text-gray-900'
                }`}>
                  Light Mode
                </p>
                <p className={`text-[13px] ${
                  theme === 'light' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  Bright and clear
                </p>
              </div>
            </div>
            {theme === 'light' && (
              <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-6">
        <div className={`p-4 ${theme === 'dark' ? 'bg-[#191C2A]' : 'bg-white'} rounded-xl`}>
          <p className={`text-[13px] ${theme === 'dark' ? 'text-[#8E8E93]' : 'text-gray-600'} leading-relaxed`}>
            Theme preference applies across all pages including dashboard, asset details, markets, and settings.
          </p>
        </div>
      </div>
    </div>
  );
}
