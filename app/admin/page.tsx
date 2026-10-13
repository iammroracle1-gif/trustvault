"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const session = localStorage.getItem('admin_session');
    if (session) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0F1018] flex items-center justify-center">
      <div className="text-white text-[15px]">Redirecting...</div>
    </div>
  );
}
