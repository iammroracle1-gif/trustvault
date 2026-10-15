"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function UserSessionCheck() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip check on public pages
    const publicPages = ['/welcome', '/connect-wallet', '/import-wallet', '/register-email', '/view-only', '/customize-wallet', '/backup-phrase', '/admin', '/admin/login', '/admin/dashboard'];
    if (publicPages.some(page => pathname?.startsWith(page))) {
      return;
    }

    const checkUserStatus = async () => {
      const walletId = localStorage.getItem('wallet_id');
      if (!walletId) return;

      try {
        const response = await fetch(`/api/user/check-status?walletId=${walletId}`);
        
        // If request failed (network error, 500, etc.), DON'T block user
        if (!response.ok && response.status >= 500) {
          console.warn('⚠️ Status check failed with server error - allowing access');
          return;
        }

        const data = await response.json();
        
        console.log('🔍 UserSessionCheck result:', {
          success: data.success,
          accountDeleted: data.accountDeleted,
          status: data.status
        });

        // CRITICAL: Only block if EXPLICITLY deleted or suspended
        // success:false with accountDeleted:true AND status is deleted/suspended
        if (
          data.accountDeleted === true && 
          (data.status === 'deleted' || data.status === 'suspended')
        ) {
          console.error('🚫 ACCOUNT DELETED - BLOCKING ACCESS');
          localStorage.clear();
          sessionStorage.clear();
          router.push('/welcome');
          alert('Your account has been removed by the administrator.');
          return;
        }
        
        // All other cases: allow access
        console.log('✅ Status check passed - allowing access');
        
      } catch (error) {
        console.error('❌ Status check error - allowing access anyway:', error);
        // On network error, allow access - don't block users
      }
    };

    // Check immediately
    checkUserStatus();

    // Check every 10 seconds
    const interval = setInterval(checkUserStatus, 10000);

    return () => clearInterval(interval);
  }, [pathname, router]);

  return null;
}
