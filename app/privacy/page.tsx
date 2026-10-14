"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <h1 className="ml-3 text-[17px] font-semibold text-white">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6 text-white">
        <section>
          <h2 className="text-xl font-bold mb-3">Privacy Policy</h2>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">1. Information We Collect</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed mb-3">
            Trust Vault is a non-custodial wallet. We do not collect, store, or have access to your private keys, seed phrases, or wallet passwords.
          </p>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            We may collect:
          </p>
          <ul className="list-disc list-inside text-[15px] text-[#9CA3AF] leading-relaxed mt-2 space-y-1">
            <li>Email addresses (if you opt in for notifications)</li>
            <li>Usage analytics (anonymous)</li>
            <li>Device information for app functionality</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">2. How We Use Your Information</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            Any information we collect is used solely to:
          </p>
          <ul className="list-disc list-inside text-[15px] text-[#9CA3AF] leading-relaxed mt-2 space-y-1">
            <li>Improve app performance and user experience</li>
            <li>Send transaction notifications (if enabled)</li>
            <li>Provide customer support</li>
            <li>Ensure security and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">3. Data Security</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            Your private keys and seed phrases are stored locally on your device only. We use industry-standard encryption to protect any data we process.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">4. Third-Party Services</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            We may use third-party services for:
          </p>
          <ul className="list-disc list-inside text-[15px] text-[#9CA3AF] leading-relaxed mt-2 space-y-1">
            <li>Blockchain data (public APIs)</li>
            <li>Analytics (anonymous)</li>
            <li>Cloud infrastructure</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">5. Your Rights</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-[15px] text-[#9CA3AF] leading-relaxed mt-2 space-y-1">
            <li>Access your data</li>
            <li>Request data deletion</li>
            <li>Opt out of analytics</li>
            <li>Export your wallet (anytime)</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">6. Contact Us</h3>
          <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
            For privacy concerns, contact us at: <a href="mailto:privacy@trust-vault.live" className="text-[#4938F5] hover:underline">privacy@trust-vault.live</a>
          </p>
        </section>

        <section className="pt-4 border-t border-white/10">
          <p className="text-[13px] text-[#9CA3AF] italic">
            By using Trust Vault, you agree to this Privacy Policy. We may update this policy from time to time and will notify users of significant changes.
          </p>
        </section>
      </div>
    </div>
  );
}
