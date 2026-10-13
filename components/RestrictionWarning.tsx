"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X, Shield } from "lucide-react";

interface RestrictionData {
  withdrawalRestricted: boolean;
  restrictionReason: string;
  status: 'active' | 'restricted' | 'suspended';
}

export default function RestrictionWarning() {
  const [restriction, setRestriction] = useState<RestrictionData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkRestrictions();
    // Check every 30 seconds for real-time updates
    const interval = setInterval(checkRestrictions, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkRestrictions = async () => {
    try {
      const walletData = localStorage.getItem('vaultora_wallets');
      if (!walletData) return;

      const wallets = JSON.parse(walletData);
      const currentWallet = wallets[0];

      const response = await fetch(`/api/user/restrictions?walletId=${currentWallet.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.withdrawalRestricted || data.status !== 'active') {
          setRestriction(data);
          setDismissed(false);
        } else {
          setRestriction(null);
        }
      }
    } catch (error) {
      console.error('Error checking restrictions:', error);
    }
  };

  if (!restriction || dismissed) return null;
  if (!restriction.withdrawalRestricted && restriction.status === 'active') return null;

  return (
    <div className="mx-4 mb-4">
      {/* Withdrawal Restriction Warning */}
      {restriction.withdrawalRestricted && (
        <div className="bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#FF453A] rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-white text-[15px] font-semibold">
                  Withdrawal Restricted
                </h3>
                <button
                  onClick={() => setDismissed(true)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-[#FF453A] text-[13px] leading-relaxed">
                {restriction.restrictionReason || 
                  'Your account has been temporarily restricted from making withdrawals. Please contact support for more information.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Account Suspended Warning */}
      {restriction.status === 'suspended' && (
        <div className="bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#FF453A] rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-white text-[15px] font-semibold">
                  Account Suspended
                </h3>
                <button
                  onClick={() => setDismissed(true)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-[#FF453A] text-[13px] leading-relaxed">
                Your account has been suspended. All transactions are temporarily disabled. Contact support at support@vaultora.app
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Account Restricted (but not suspended) */}
      {restriction.status === 'restricted' && !restriction.withdrawalRestricted && (
        <div className="bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#FF9500] rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-white text-[15px] font-semibold">
                  Account Under Review
                </h3>
                <button
                  onClick={() => setDismissed(true)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-[#FF9500] text-[13px] leading-relaxed">
                Your account is currently under review. Some features may be limited.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
