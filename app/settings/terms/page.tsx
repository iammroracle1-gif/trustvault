"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Shield } from "lucide-react";

export default function TermsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"terms" | "privacy">("terms");

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
            Legal
          </h1>
        </div>

        {/* Segmented Control - iOS Style */}
        <div className="px-4 py-3">
          <div className="bg-[#1C1C1E] rounded-[10px] p-0.5 flex">
            <button
              onClick={() => setSelectedTab("terms")}
              className={`flex-1 py-1.5 rounded-[8px] text-[13px] font-medium transition-all ${
                selectedTab === "terms"
                  ? "bg-[#48484A] text-white"
                  : "text-[#8E8E93]"
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setSelectedTab("privacy")}
              className={`flex-1 py-1.5 rounded-[8px] text-[13px] font-medium transition-all ${
                selectedTab === "privacy"
                  ? "bg-[#48484A] text-white"
                  : "text-[#8E8E93]"
              }`}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {selectedTab === "terms" ? (
          /* Terms of Service */
          <div className="space-y-4">
            <div className="text-[#8E8E93] text-[11px] uppercase tracking-wide px-1">
              Last updated: December 2024
            </div>

            <section className="space-y-3">
              <h2 className="text-white font-semibold text-[20px] tracking-tight">Terms of Service</h2>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed">
                By accessing and using Trust Vault ("the Wallet"), you accept and agree to be bound by these Terms. Trust Vault is a non-custodial cryptocurrency wallet for storing and managing blockchain assets.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-white font-semibold text-[17px]">Non-Custodial Service</h3>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed mb-2">
                Trust Vault is non-custodial, which means:
              </p>
              <ul className="space-y-1.5 pl-4">
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  You have complete control over your private keys
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  We cannot access or control your funds
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  We cannot recover lost seed phrases
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  We cannot reverse transactions
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-white font-semibold text-[17px]">Your Responsibilities</h3>
              <ul className="space-y-1.5 pl-4">
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  Secure your seed phrase and private keys
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  Never share credentials with anyone
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  Verify all transaction details
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  Understand transactions are irreversible
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-white font-semibold text-[17px]">Risks</h3>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed">
                Cryptocurrency involves risks including price volatility, network delays, smart contract vulnerabilities, and phishing attacks. You use Trust Vault at your own risk.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-white font-semibold text-[17px]">Limitation of Liability</h3>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed">
                Trust Vault is provided "as is" without warranties. We are not liable for any loss of funds or damages arising from wallet use, user error, network failures, or third-party actions.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-white font-semibold text-[17px]">Contact</h3>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed">
                Questions? Email us at{' '}
                <a href="mailto:legal@vaultora.app" className="text-[#4938F5]">
                  legal@vaultora.app
                </a>
              </p>
            </section>
          </div>
        ) : (
          /* Privacy Policy */
          <div className="space-y-4">
            <div className="text-[#8E8E93] text-[11px] uppercase tracking-wide px-1">
              Last updated: December 2024
            </div>

            <section className="space-y-3">
              <h2 className="text-white font-semibold text-[20px] tracking-tight">Privacy Policy</h2>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed">
                Trust Vault is committed to protecting your privacy. This policy explains our data practices for our non-custodial wallet.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-white font-semibold text-[17px]">Data We Collect</h3>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed font-medium mb-2">
                Local Storage Only
              </p>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed mb-2">
                We do not collect or store:
              </p>
              <ul className="space-y-1.5 pl-4">
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  Private keys or seed phrases
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  Wallet addresses
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  Transaction history
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  Personal identification
                </li>
              </ul>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed mt-2">
                All data is stored locally on your device.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-white font-semibold text-[17px]">Third-Party Services</h3>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed mb-2">
                We use these services:
              </p>
              <ul className="space-y-1.5 pl-4">
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  CoinGecko API for price data
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  CoinCap API as fallback
                </li>
                <li className="text-[#8E8E93] text-[15px] leading-relaxed list-disc">
                  Blockchain networks for transactions
                </li>
              </ul>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed mt-2">
                We don't share your personal information with these services.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-white font-semibold text-[17px]">Security</h3>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed">
                We use client-side key generation, no server-side storage of sensitive data, HTTPS encryption, and secure WebView for DApps. However, you're responsible for securing your device and seed phrase.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-white font-semibold text-[17px]">Your Rights</h3>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed">
                Since we don't collect data on our servers, you have complete control. Delete wallet data anytime by clearing your browser's local storage.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-white font-semibold text-[17px]">Contact</h3>
              <p className="text-[#8E8E93] text-[15px] leading-relaxed">
                Privacy questions? Email{' '}
                <a href="mailto:privacy@vaultora.app" className="text-[#4938F5]">
                  privacy@vaultora.app
                </a>
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
