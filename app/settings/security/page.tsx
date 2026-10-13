"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Key, ShieldCheck, Eye } from "lucide-react";
import { useState } from "react";

const securityOptions = [
  {
    IconComponent: Lock,
    iconColor: "#5AC8FA",
    title: "Change Password",
    description: "Update your account password",
    route: "/settings/security/password",
  },
  {
    IconComponent: Key,
    iconColor: "#FF9500",
    title: "Backup Seed Phrase",
    description: "View and backup your recovery phrase",
    route: "/settings/security/backup",
    warning: true,
  },
  {
    IconComponent: ShieldCheck,
    iconColor: "#34C759",
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security",
    badge: "Recommended",
  },
  {
    IconComponent: Eye,
    iconColor: "#B967FF",
    title: "Privacy Mode",
    description: "Hide wallet balances",
    toggle: true,
  },
];

export default function SecurityPage() {
  const router = useRouter();
  const [privacyMode, setPrivacyMode] = useState(false);

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
        <h1 className="text-xl font-semibold text-white">Security</h1>
        <div className="w-10" />
      </div>

      {/* Security Options */}
      <div className="p-4 space-y-3">
        {securityOptions.map((option, index) => {
          const Icon = option.IconComponent;
          
          if (option.toggle) {
            return (
              <div
                key={index}
                className="p-4 bg-[#191C2A] rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${option.iconColor}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: option.iconColor }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-base">{option.title}</p>
                    <p className="text-sm text-[#9CA3AF]">{option.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPrivacyMode(!privacyMode)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    privacyMode ? "bg-[#4938F5]" : "bg-[#3A3A3C]"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                      privacyMode ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            );
          }

          return (
            <button
              key={index}
              onClick={() => option.route && router.push(option.route)}
              className={`w-full p-4 bg-[#191C2A] rounded-2xl hover:bg-[#202437] transition-all ${
                option.warning ? "ring-2 ring-[#FF9500]/30" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${option.iconColor}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: option.iconColor }} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white text-base">{option.title}</p>
                    <p className="text-sm text-[#9CA3AF]">{option.description}</p>
                  </div>
                </div>
                {option.badge && (
                  <span className="px-3 py-1 bg-[#34C759]/20 text-[#34C759] text-xs font-semibold rounded-full">
                    {option.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Security Tips */}
      <div className="px-6 py-4">
        <h3 className="text-sm font-semibold text-white mb-3">Security Tips</h3>
        <div className="space-y-2">
          <div className="p-3 bg-[#191C2A] rounded-xl flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#75F59A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-[#75F59A]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-[#9CA3AF]">
              Never share your seed phrase or private keys with anyone
            </p>
          </div>
          <div className="p-3 bg-[#191C2A] rounded-xl flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#75F59A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-[#75F59A]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-[#9CA3AF]">
              Store your recovery phrase offline in a secure location
            </p>
          </div>
          <div className="p-3 bg-[#191C2A] rounded-xl flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#75F59A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-[#75F59A]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-[#9CA3AF]">
              Be cautious of phishing attempts and fake websites
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
