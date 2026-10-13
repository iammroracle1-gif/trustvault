"use client";

import { useState } from "react";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const sendTestEmail = async () => {
    if (!email) {
      setStatus("Please enter an email address");
      return;
    }

    setLoading(true);
    setStatus("Sending...");

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus(`✅ Email sent successfully! Email ID: ${data.emailId}`);
      } else {
        setStatus(`❌ Failed: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1018] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
        <h1 className="text-white text-2xl font-bold mb-4">Test Email</h1>
        <p className="text-[#8E8E93] text-sm mb-6">
          Send a test email to verify Resend configuration
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-3 bg-[#0F1018] border border-white/10 rounded-xl text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#4938F5] transition-colors mb-4"
        />

        <button
          onClick={sendTestEmail}
          disabled={loading}
          className="w-full py-3 bg-[#4938F5] text-white text-[15px] font-semibold rounded-xl hover:bg-[#5D4EFF] disabled:opacity-50 transition-colors mb-4"
        >
          {loading ? "Sending..." : "Send Test Email"}
        </button>

        {status && (
          <div className="p-4 bg-[#2C2C2E] rounded-xl">
            <pre className="text-white text-xs whitespace-pre-wrap break-words">
              {status}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
