"use client";

import { useRouter } from "next/navigation";
import { Bell, Settings } from "lucide-react";
import { useState, useEffect } from "react";

interface TopNavProps {
  title: string;
  showBackButton?: boolean;
  leftButton?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export default function TopNav({ title, showBackButton = false, leftButton, showBack = false, onBack }: TopNavProps) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    
    // Listen for storage changes
    const handleStorage = () => loadUnreadCount();
    window.addEventListener('storage', handleStorage);
    
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loadUnreadCount = () => {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const notifications = JSON.parse(saved);
        const unread = notifications.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      setUnreadCount(0);
    }
  };

  return (
    <div className="sticky top-0 bg-[#0F1018]/80 backdrop-blur-xl z-10 border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side */}
        <div className="w-10">
          {showBack ? (
            <button 
              onClick={onBack || (() => router.back())}
              className="text-white text-[17px] font-medium"
            >
              ←
            </button>
          ) : (
            leftButton
          )}
        </div>

        {/* Center Title */}
        <h1 className="text-base font-semibold text-white">{title}</h1>

        {/* Right Side - Notifications & Settings */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/notifications")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-white" />
            {/* Notification badge - only show if there are unread */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-[#FF453A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
