"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface AccountDeletedModalProps {
  onConfirm: () => void;
}

export default function AccountDeletedModal({ onConfirm }: AccountDeletedModalProps) {
  const router = useRouter();

  useEffect(() => {
    // Prevent back navigation
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  const handleConfirm = () => {
    // Clear all user data
    localStorage.clear();
    sessionStorage.clear();
    
    // Call parent callback
    onConfirm();
    
    // Redirect to welcome page
    router.replace('/welcome');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-[340px] bg-[#1C1C1E] rounded-3xl shadow-2xl overflow-hidden">
        {/* Icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-20 h-20 rounded-full bg-[#FF453A]/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-[#FF453A]" strokeWidth={2} />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          <h2 className="text-[20px] font-bold text-white mb-2 leading-tight">
            Account Disabled
          </h2>
          <p className="text-[15px] text-[#8E8E93] leading-[22px] mb-6">
            Your account has been disabled by an administrator. You will be logged out and cannot access this account anymore.
          </p>

          {/* Button */}
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white font-semibold text-[17px] rounded-xl transition-all active:scale-[0.98]"
          >
            I Understand
          </button>
        </div>

        {/* Bottom text */}
        <div className="px-6 pb-6 text-center">
          <p className="text-[13px] text-[#8E8E93]">
            Contact support if you believe this is an error
          </p>
        </div>
      </div>
    </div>
  );
}
