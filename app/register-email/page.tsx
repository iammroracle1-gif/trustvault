"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, AlertCircle } from "lucide-react";

export default function RegisterEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setError("");

    // Validation
    if (!email || !confirmEmail) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (email !== confirmEmail) {
      setError("Email addresses do not match");
      return;
    }

    setLoading(true);

    try {
      // Get wallet address from session
      const walletAddress = sessionStorage.getItem("wallet_address");
      
      if (!walletAddress) {
        setError("Wallet not found. Please start over.");
        setLoading(false);
        return;
      }

      // Register user in database
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          walletAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to register email');
        setLoading(false);
        return;
      }

      // Store wallet ID and email in session
      sessionStorage.setItem("wallet_id", data.data.walletId);
      sessionStorage.setItem("wallet_email", email);

      // Go to backup phrase page
      router.push("/backup-phrase");
    } catch (error) {
      console.error('Registration error:', error);
      setError("Failed to register. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1018] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-[#0F1018]/95 backdrop-blur-xl z-10 border-b border-white/5">
        <div className="flex items-center px-4 h-14">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 -ml-1 hover:opacity-70 transition-opacity active:scale-95"
          >
            <ArrowLeft className="w-[22px] h-[22px] text-white" strokeWidth={2.5} />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-semibold text-white tracking-tight -ml-6">
            Register Email
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#4938F5]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-[#4938F5]" strokeWidth={2} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-3">
          Enter Your Email
        </h2>
        <p className="text-[#8E8E93] text-center text-[15px] mb-8 max-w-md mx-auto">
          We'll use this email to send you important notifications about your wallet and transactions.
        </p>

        {/* Email Input */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-white text-[13px] font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-[#1C1C1E] border border-white/10 rounded-xl text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#4938F5] transition-colors"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div>
            <label className="block text-white text-[13px] font-medium mb-2">
              Confirm Email
            </label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value.toLowerCase())}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-[#1C1C1E] border border-white/10 rounded-xl text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#4938F5] transition-colors"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#FF453A] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[#FF453A] text-[15px]">{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mb-8 p-4 bg-[#4938F5]/10 border border-[#4938F5]/30 rounded-xl">
          <p className="text-white text-[13px] font-medium mb-2">Why we need your email:</p>
          <ul className="space-y-1.5 text-[#8E8E93] text-[13px]">
            <li className="flex items-start gap-2">
              <span className="text-[#4938F5] mt-0.5">•</span>
              <span>Transaction notifications and confirmations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4938F5] mt-0.5">•</span>
              <span>Security alerts and account activity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4938F5] mt-0.5">•</span>
              <span>Wallet recovery and support</span>
            </li>
          </ul>
        </div>

        {/* Privacy Notice */}
        <p className="text-[#8E8E93] text-[13px] text-center">
          Your email is encrypted and never shared with third parties. Read our{" "}
          <a href="/settings/terms" className="text-[#4938F5] underline">
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleContinue}
          disabled={loading || !email || !confirmEmail}
          className="w-full py-4 bg-[#4938F5] text-white text-[17px] font-semibold rounded-xl hover:bg-[#3D2DD4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
        >
          {loading ? "Registering..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
