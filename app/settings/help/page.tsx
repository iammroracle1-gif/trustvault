"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Search, MessageCircle, Book, Mail, ExternalLink, FileText, HelpCircle, Shield, Send } from "lucide-react";
import { useState } from "react";

const helpTopics = [
  {
    category: "Getting Started",
    icon: Sparkles,
    items: [
      { title: "How to create a wallet", url: "https://docs.vaultora.app/getting-started/create-wallet" },
      { title: "Import existing wallet", url: "https://docs.vaultora.app/getting-started/import-wallet" },
      { title: "Backup your seed phrase", url: "https://docs.vaultora.app/security/backup" },
      { title: "Understanding gas fees", url: "https://docs.vaultora.app/transactions/gas-fees" },
    ],
  },
  {
    category: "Transactions",
    icon: Send,
    items: [
      { title: "How to send crypto", url: "https://docs.vaultora.app/transactions/send" },
      { title: "How to receive crypto", url: "https://docs.vaultora.app/transactions/receive" },
      { title: "View transaction history", url: "https://docs.vaultora.app/transactions/history" },
      { title: "Transaction stuck or pending", url: "https://docs.vaultora.app/troubleshooting/stuck-transaction" },
    ],
  },
  {
    category: "Security",
    icon: Shield,
    items: [
      { title: "Best security practices", url: "https://docs.vaultora.app/security/best-practices" },
      { title: "Lost my seed phrase", url: "https://docs.vaultora.app/security/recovery" },
      { title: "Suspicious activity detected", url: "https://docs.vaultora.app/security/suspicious-activity" },
      { title: "Enable biometric authentication", url: "https://docs.vaultora.app/security/biometric" },
    ],
  },
  {
    category: "Troubleshooting",
    icon: HelpCircle,
    items: [
      { title: "App not loading", url: "https://docs.vaultora.app/troubleshooting/app-loading" },
      { title: "Balance not showing", url: "https://docs.vaultora.app/troubleshooting/balance" },
      { title: "Can't connect to DApp", url: "https://docs.vaultora.app/troubleshooting/dapp-connection" },
      { title: "Reset wallet", url: "https://docs.vaultora.app/troubleshooting/reset" },
    ],
  },
];

const quickActions = [
  {
    title: "Documentation",
    description: "Browse complete guides",
    icon: Book,
    url: "https://docs.vaultora.app",
    color: "#4938F5",
  },
  {
    title: "Community Forum",
    description: "Ask questions, share tips",
    icon: MessageCircle,
    url: "https://community.vaultora.app",
    color: "#5AC8FA",
  },
  {
    title: "Email Support",
    description: "Get personalized help",
    icon: Mail,
    url: "mailto:support@vaultora.app",
    color: "#34C759",
  },
];

function Sparkles({ className, style }: any) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = helpTopics.map(topic => ({
    ...topic,
    items: topic.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(topic => topic.items.length > 0);

  return (
    <div className="min-h-screen bg-[#0F1018] pb-6">
      {/* Header - iOS Clean */}
      <div className="sticky top-0 bg-[#0F1018]/95 backdrop-blur-xl z-10 border-b border-white/5">
        <div className="flex items-center px-4 h-11">
          <button
            onClick={() => router.push('/settings')}
            className="flex items-center gap-1 -ml-1 hover:opacity-70 transition-opacity active:scale-95"
          >
            <ArrowLeft className="w-[22px] h-[22px] text-white" strokeWidth={2.5} />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-semibold text-white tracking-tight -ml-6">
            Help & Support
          </h1>
        </div>
        
        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#8E8E93]" />
            <input
              type="text"
              placeholder="Search for help"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-[#1C1C1E] rounded-[10px] text-white text-[17px] placeholder-[#8E8E93] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (action.url.startsWith('mailto:')) {
                      window.location.href = action.url;
                    } else {
                      window.open(action.url, '_blank');
                    }
                  }}
                  className="w-full p-3 bg-[#1C1C1E] rounded-2xl hover:bg-[#2C2C2E] transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${action.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: action.color }} strokeWidth={2} />
                      </div>
                      <div className="text-left">
                        <p className="text-white text-[15px] font-medium">{action.title}</p>
                        <p className="text-[#8E8E93] text-[13px]">{action.description}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#8E8E93]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Help Topics */}
        <div>
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
            Browse Topics
          </h2>
          <div className="space-y-4">
            {(searchQuery ? filteredTopics : helpTopics).map((topic, index) => {
              const Icon = topic.icon;
              return (
                <div key={index} className="bg-[#1C1C1E] rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                    <Icon className="w-4 h-4 text-[#4938F5]" strokeWidth={2} />
                    <h3 className="text-white text-[15px] font-semibold">{topic.category}</h3>
                  </div>
                  <div className="divide-y divide-white/5">
                    {topic.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        onClick={() => window.open(item.url, '_blank')}
                        className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors active:bg-white/10 flex items-center justify-between"
                      >
                        <span className="text-white text-[15px]">{item.title}</span>
                        <ExternalLink className="w-4 h-4 text-[#8E8E93] flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-gradient-to-br from-[#4938F5]/20 to-[#7D7AFF]/20 border border-[#4938F5]/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#4938F5] rounded-full flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-white text-[15px] font-semibold mb-1">Still need help?</h3>
              <p className="text-[#8E8E93] text-[13px] leading-relaxed">
                Our support team is here to assist you. Email us at{' '}
                <a href="mailto:support@vaultora.app" className="text-[#4938F5] underline">
                  support@vaultora.app
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
