"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Search, X, Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "zh", name: "Chinese (Simplified)", native: "简体中文" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
];

export default function LanguagePage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Language
          </h1>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#8E8E93]" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-9 bg-[#1C1C1E] rounded-[10px] text-white text-[17px] placeholder-[#8E8E93] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-[#48484A] rounded-full active:scale-90 transition-transform"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 mb-3 p-3 bg-[#4938F5]/10 border border-[#4938F5]/30 rounded-2xl">
        <div className="flex items-start gap-2.5">
          <Globe className="w-5 h-5 text-[#4938F5] flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <p className="text-white text-[13px] font-medium mb-0.5">Translation in Progress</p>
            <p className="text-[#8E8E93] text-[13px] leading-relaxed">
              We're working on translations. Use i18n libraries like next-intl for production implementation.
            </p>
          </div>
        </div>
      </div>

      {/* Languages List */}
      <div className="px-4">
        <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden divide-y divide-white/5">
          {filteredLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => setSelectedLanguage(language.code)}
              className="w-full px-4 py-3 hover:bg-white/5 transition-colors active:bg-white/10 flex items-center justify-between"
            >
              <div className="text-left">
                <p className="text-white text-[17px] font-medium">{language.native}</p>
                <p className="text-[#8E8E93] text-[13px]">{language.name}</p>
              </div>
              {selectedLanguage === language.code && (
                <Check className="w-5 h-5 text-[#4938F5]" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>

        {filteredLanguages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#8E8E93] text-[15px]">No languages found</p>
          </div>
        )}
      </div>
    </div>
  );
}
