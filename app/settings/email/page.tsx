"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Check, AlertCircle } from "lucide-react";

export default function EmailSettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [notifications, setNotifications] = useState({
    deposits: true,
    withdrawals: true,
    transfers: true,
    trades: true,
    security: true,
    priceAlerts: false,
  });

  useEffect(() => {
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    try {
      const walletData = localStorage.getItem('vaultora_wallets');
      if (walletData) {
        const wallets = JSON.parse(walletData);
        const currentWallet = wallets[0]; // Get current wallet
        
        const response = await fetch(`/api/user/email?walletId=${currentWallet.id}`);
        if (response.ok) {
          const data = await response.json();
          setEmail(data.email || '');
          setIsVerified(data.isVerified || false);
          setNotifications(data.notifications || notifications);
        }
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    }
  };

  const handleSave = async () => {
    if (!email || !validateEmail(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const walletData = localStorage.getItem('vaultora_wallets');
      if (!walletData) {
        throw new Error('No wallet found');
      }

      const wallets = JSON.parse(walletData);
      const currentWallet = wallets[0];

      const response = await fetch('/api/user/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId: currentWallet.id,
          email,
          notifications,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email settings saved successfully' });
        setIsVerified(true);
      } else {
        throw new Error('Failed to save email settings');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save email settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="min-h-screen bg-[#0F1018] pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-[#0F1018]/95 backdrop-blur-xl z-10 border-b border-white/5">
        <div className="flex items-center px-4 h-11">
          <button
            onClick={() => router.push('/settings')}
            className="flex items-center gap-1 -ml-1 hover:opacity-70 transition-opacity active:scale-95"
          >
            <ArrowLeft className="w-[22px] h-[22px] text-white" strokeWidth={2.5} />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-semibold text-white tracking-tight -ml-6">
            Email Notifications
          </h1>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Email Configuration */}
        <div>
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
            Email Address
          </h2>
          <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#4938F5]/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#4938F5]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white text-[17px] placeholder-[#8E8E93] focus:outline-none"
                  />
                </div>
                {isVerified && (
                  <Check className="w-5 h-5 text-[#34C759]" strokeWidth={2.5} />
                )}
              </div>
              <p className="text-[#8E8E93] text-[13px] leading-relaxed">
                Receive transaction notifications and security alerts via email
              </p>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
            Notification Preferences
          </h2>
          <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden divide-y divide-white/5">
            {[
              { key: 'deposits', label: 'Deposits', description: 'When you receive funds' },
              { key: 'withdrawals', label: 'Withdrawals', description: 'When you send funds' },
              { key: 'transfers', label: 'Transfers', description: 'Internal transfers' },
              { key: 'trades', label: 'Trades', description: 'Perpetual trades activity' },
              { key: 'security', label: 'Security Alerts', description: 'Important security notifications' },
              { key: 'priceAlerts', label: 'Price Alerts', description: 'Cryptocurrency price changes' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className="w-full px-4 py-3 hover:bg-white/5 transition-colors active:bg-white/10 flex items-center justify-between"
              >
                <div className="text-left flex-1">
                  <p className="text-white text-[15px] font-medium">{item.label}</p>
                  <p className="text-[#8E8E93] text-[13px]">{item.description}</p>
                </div>
                <div className={`w-[51px] h-[31px] rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-[#34C759]' : 'bg-[#48484A]'
                }`}>
                  <div className={`w-[27px] h-[27px] bg-white rounded-full shadow-lg transition-transform duration-200 mt-[2px] ${
                    notifications[item.key as keyof typeof notifications] ? 'ml-[22px]' : 'ml-[2px]'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-2xl flex items-start gap-3 ${
            message.type === 'success' 
              ? 'bg-[#34C759]/10 border border-[#34C759]/30'
              : 'bg-[#FF453A]/10 border border-[#FF453A]/30'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-5 h-5 text-[#34C759] flex-shrink-0 mt-0.5" strokeWidth={2} />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#FF453A] flex-shrink-0 mt-0.5" strokeWidth={2} />
            )}
            <p className={`text-[15px] ${
              message.type === 'success' ? 'text-[#34C759]' : 'text-[#FF453A]'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving || !email}
          className="w-full py-4 bg-[#4938F5] text-white font-semibold text-[17px] rounded-2xl hover:bg-[#5D4EFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>

        {/* Info */}
        <div className="p-4 bg-[#1C1C1E] rounded-2xl">
          <h3 className="text-white text-[15px] font-semibold mb-2">Privacy Notice</h3>
          <p className="text-[#8E8E93] text-[13px] leading-relaxed">
            Your email is encrypted and stored securely. We never share your email with third parties. 
            You can update or remove your email at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
