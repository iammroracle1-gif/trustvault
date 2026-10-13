"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, User, Shield, Bell, Palette, Globe, HelpCircle, FileText, LogOut, Mail } from "lucide-react";

const settingsGroups = [
  {
    title: "Account",
    items: [
      { icon: User, color: "#5AC8FA", label: "Profile", route: "/settings/profile" },
      { icon: Mail, color: "#FF9500", label: "Email Notifications", route: "/settings/email" },
      { icon: Shield, color: "#34C759", label: "Security", route: "/settings/security" },
      { icon: Bell, color: "#FF9500", label: "Notifications", route: "/settings/notifications" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Palette, color: "#B967FF", label: "Appearance", route: "/settings/appearance" },
      { icon: Globe, color: "#5AC8FA", label: "Language", route: "/settings/language", badge: "English" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, color: "#00C7BE", label: "Help Center", route: "/settings/help" },
      { icon: FileText, color: "#FF2D55", label: "Terms & Privacy", route: "/settings/terms" },
    ],
  },
];

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/welcome");
  };

  return (
    <div className="min-h-screen bg-[#0F1018]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#303344]">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#191C2A] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Settings</h1>
        <div className="w-10" />
      </div>

      {/* Settings Groups */}
      <div className="py-4">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <h2 className="px-6 py-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
              {group.title}
            </h2>
            <div className="bg-[#191C2A] mx-4 rounded-2xl overflow-hidden">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={() => router.push(item.route)}
                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#202437] transition-colors border-b border-[#303344] last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <span className="text-base text-white font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-sm text-[#9CA3AF]">{item.badge}</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="px-4 mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Disconnect Wallet
          </button>
        </div>

        {/* Version */}
        <div className="px-6 py-6 text-center">
          <p className="text-sm text-[#9CA3AF]">Trust Vault v0.1.0</p>
          <p className="text-xs text-[#9CA3AF]/70 mt-1">
            Made with ❤️ by Trust Vault Team
          </p>
        </div>
      </div>
    </div>
  );
}
