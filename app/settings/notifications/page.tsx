"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, TrendingUp, Lock, Sparkles } from "lucide-react";

const notificationSettings = [
  {
    category: "Transactions",
    IconComponent: Send,
    color: "#34C759",
    settings: [
      { id: "transaction-confirm", label: "Transaction Confirmations", enabled: true },
      { id: "transaction-receive", label: "Received Payments", enabled: true },
      { id: "transaction-sent", label: "Sent Payments", enabled: true },
    ],
  },
  {
    category: "Price Alerts",
    IconComponent: TrendingUp,
    color: "#5AC8FA",
    settings: [
      { id: "price-increase", label: "Significant Price Increases", enabled: true },
      { id: "price-decrease", label: "Significant Price Decreases", enabled: false },
      { id: "price-target", label: "Price Targets Reached", enabled: true },
    ],
  },
  {
    category: "Security",
    IconComponent: Lock,
    color: "#FF9500",
    settings: [
      { id: "security-login", label: "New Device Login", enabled: true },
      { id: "security-settings", label: "Settings Changes", enabled: true },
      { id: "security-suspicious", label: "Suspicious Activity", enabled: true },
    ],
  },
  {
    category: "Updates",
    IconComponent: Sparkles,
    color: "#B967FF",
    settings: [
      { id: "updates-features", label: "New Features", enabled: true },
      { id: "updates-news", label: "Crypto News", enabled: false },
      { id: "updates-tips", label: "Tips & Tutorials", enabled: true },
    ],
  },
];

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(notificationSettings);

  const toggleSetting = (categoryIndex: number, settingId: string) => {
    setSettings(prev => prev.map((category, idx) => {
      if (idx === categoryIndex) {
        return {
          ...category,
          settings: category.settings.map(setting =>
            setting.id === settingId
              ? { ...setting, enabled: !setting.enabled }
              : setting
          ),
        };
      }
      return category;
    }));
  };

  return (
    <div className="min-h-screen bg-[#0F1018] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-[#0F1018] z-10 border-b border-[#303344]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-[#191C2A] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Notifications</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="px-4 py-4">
        {settings.map((category, categoryIndex) => {
          const CategoryIcon = category.IconComponent;
          
          return (
            <div key={categoryIndex} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <CategoryIcon className="w-4 h-4" style={{ color: category.color }} />
                </div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
                  {category.category}
                </h2>
              </div>

            <div className="bg-[#191C2A] rounded-2xl overflow-hidden">
              {category.settings.map((setting, settingIndex) => (
                <div
                  key={setting.id}
                  className={`px-4 py-4 flex items-center justify-between ${
                    settingIndex !== category.settings.length - 1
                      ? "border-b border-[#303344]"
                      : ""
                  }`}
                >
                  <p className="text-white text-base">{setting.label}</p>
                  <button
                    onClick={() => toggleSetting(categoryIndex, setting.id)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      setting.enabled ? "bg-[#4938F5]" : "bg-[#3A3A3C]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                        setting.enabled ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
        })}
      </div>

      {/* Info */}
      <div className="px-4">
        <div className="p-4 bg-[#191C2A] rounded-2xl">
          <p className="text-[#9CA3AF] text-sm leading-relaxed">
            <span className="text-white font-semibold">Note:</span> You can manage push notification permissions in your device settings. Some notifications may still appear in-app even when push notifications are disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
