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
        const response = await fetch(`/api/user/status?walletId=${walletId}`);
        const data = await response.json();

        if (!data.exists || data.deleted) {
          // User has been deleted - clear session and redirect
          localStorage.clear();
          sessionStorage.clear();
          router.push('/welcome');
          alert('Your account has been removed by the administrator.');
        }
      } catch (error) {
        console.error('Failed to check user status:', error);
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
