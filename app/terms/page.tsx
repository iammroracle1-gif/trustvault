"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0F1018]">
      {/* Header */}
      <div className="sticky top-0 bg-[#0F1018]/95 backdrop-blur-xl z-10 border-b border-white/5">
        <div className="flex items-center px-6 py-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
          <h1 className="ml-3 text-[17px] font-semibold text-white">Terms of Service</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6 text-white">
        <section>
          <h2 className="text-xl font-bold mb-3">Terms of Service</h2>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            By accessing and using Trust Vault, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">2. Non-Custodial Wallet</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            Trust Vault is a non-custodial cryptocurrency wallet. You are solely responsible for:
          </p>
          <ul className="list-disc list-inside text-[15px] text-[#9CA3AF] leading-relaxed mt-2 space-y-1">
            <li>Safeguarding your private keys and seed phrases</li>
            <li>All transactions made from your wallet</li>
            <li>Any loss of funds due to lost or compromised keys</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">3. User Responsibilities</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed mb-3">
            You agree to:
          </p>
          <ul className="list-disc list-inside text-[15px] text-[#9CA3AF] leading-relaxed space-y-1">
            <li>Use the app legally and responsibly</li>
            <li>Not attempt to hack or compromise the app</li>
            <li>Keep your device secure and updated</li>
            <li>Backup your seed phrase securely</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">4. Limitation of Liability</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            Trust Vault provides the wallet "as is" without warranties. We are not liable for:
          </p>
          <ul className="list-disc list-inside text-[15px] text-[#9CA3AF] leading-relaxed mt-2 space-y-1">
            <li>Loss of funds due to user error</li>
            <li>Blockchain network issues</li>
            <li>Third-party service failures</li>
            <li>Market volatility or price changes</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">5. Prohibited Activities</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed mb-3">
            You may not use Trust Vault for:
          </p>
          <ul className="list-disc list-inside text-[15px] text-[#9CA3AF] leading-relaxed space-y-1">
            <li>Illegal activities or money laundering</li>
            <li>Financing terrorism or prohibited activities</li>
            <li>Violating sanctions or regulations</li>
            <li>Fraudulent transactions</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">6. Intellectual Property</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            Trust Vault and its content are protected by copyright and trademark laws. You may not copy, modify, or distribute the app without permission.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">7. Updates and Changes</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the app constitutes acceptance of updated terms.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">8. Contact Us</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            For questions about these terms, contact: <a href="mailto:support@trust-vault.live" className="text-[#4938F5] hover:underline">support@trust-vault.live</a>
          </p>
        </section>

        <section className="pt-4 border-t border-white/10">
          <p className="text-[13px] text-[#9CA3AF] italic">
            By creating or importing a wallet, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
        </section>
      </div>
    </div>
  );
}
