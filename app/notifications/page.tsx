"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ArrowUpRight, TrendingUp, Shield, Sparkles, ArrowDownLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Notification {
  id: string;
  type: "transaction" | "price" | "news" | "security";
  title: string;
  message: string;
  time: string;
  read: boolean;
  iconName: string; // Changed from icon to iconName
  color: string;
  timestamp: number;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
    
    // Reload notifications every 10 seconds to update timestamps
    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Update timestamps to show proper time ago
        const updated = parsed.map((n: Notification) => ({
          ...n,
          time: formatTimeAgo(n.timestamp)
        }));
        setNotifications(updated);
      } else {
        // Initialize with welcome notifications for new users
        const welcomeNotifications: Notification[] = [
          {
            id: `notif-${Date.now()}-1`,
            type: "security",
            title: "Welcome to Trust Vault",
            message: "Your wallet is secured with industry-standard encryption",
            time: "Just now",
            read: false,
            iconName: "Shield",
            color: "#4938F5",
            timestamp: Date.now(),
          },
          {
            id: `notif-${Date.now()}-2`,
            type: "news",
            title: "Backup Your Wallet",
            message: "Save your recovery phrase in a secure location. Never share it with anyone.",
            time: "Just now",
            read: false,
            iconName: "Sparkles",
            color: "#FF9500",
            timestamp: Date.now() - 1000,
          },
        ];
        setNotifications(welcomeNotifications);
        localStorage.setItem('notifications', JSON.stringify(welcomeNotifications));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  // Format timestamp to readable time ago
  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    // For older than a week, show actual date
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Helper function to get icon component from name
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Shield,
      Sparkles,
      ArrowUpRight,
      TrendingUp,
      ArrowDownLeft,
      Check,
    };
    return icons[iconName] || Shield;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  // Group notifications by date
  const today = notifications.filter(n => {
    const diff = Date.now() - n.timestamp;
    return diff < 24 * 60 * 60 * 1000; // Less than 24 hours
  });

  const earlier = notifications.filter(n => {
    const diff = Date.now() - n.timestamp;
    return diff >= 24 * 60 * 60 * 1000; // More than 24 hours
  });

  // Theme-aware colors
  const bgPrimary = theme === 'dark' ? 'bg-[#0F1018]' : 'bg-[#F5F5F7]';
  const bgHeader = theme === 'dark' ? 'bg-[#0F1018]/95' : 'bg-[#F5F5F7]/95';
  const bgHover = theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100';
  const bgHoverButton = theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200';
  const bgEmpty = theme === 'dark' ? 'bg-white/5' : 'bg-gray-200';
  const bgBadge = theme === 'dark' ? 'bg-white/5' : 'bg-gray-100';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-[#8E8E93]' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-white/5' : 'border-gray-200';
  const dividerColor = theme === 'dark' ? 'divide-white/5' : 'divide-gray-200';
  const unreadDot = theme === 'dark' ? 'bg-white' : 'bg-[#4938F5]';

  return (
    <div className={`min-h-screen ${bgPrimary}`}>
      {/* Header - Clean iOS */}
      <div className={`sticky top-0 ${bgHeader} backdrop-blur-xl z-10 border-b ${borderColor}`}>
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => {
              console.log('Back button clicked');
              router.push('/dashboard');
            }}
            className={`p-2 -ml-2 ${bgHoverButton} rounded-lg transition-all active:scale-95`}
          >
            <ArrowLeft className={`w-6 h-6 ${textPrimary}`} strokeWidth={2.5} />
          </button>
          <h1 className={`absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold ${textPrimary} tracking-tight`}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[15px] text-[#4938F5] font-medium hover:opacity-70 px-2 py-1"
            >
              Read All
            </button>
          )}
        </div>
      </div>

      {/* Unread Badge - Modern iOS style */}
      {unreadCount > 0 && (
        <div className={`px-4 py-3 ${bgBadge} border-b ${borderColor}`}>
          <p className={`text-[13px] ${textPrimary} font-medium text-center`}>
            {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Notifications List - Modern clean */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className={`w-16 h-16 ${bgEmpty} rounded-full flex items-center justify-center mb-3`}>
            <Check className={`w-7 h-7 ${textSecondary}`} strokeWidth={2} />
          </div>
          <p className={`text-[17px] font-semibold ${textPrimary} mb-1`}>
            No Notifications
          </p>
          <p className={`text-[15px] ${textSecondary}`}>
            You're all caught up
          </p>
        </div>
      ) : (
        <div>
          {/* Today Section */}
          {today.length > 0 && (
            <>
              <div className="px-4 pt-4 pb-2">
                <p className={`text-[13px] font-semibold ${textSecondary} uppercase tracking-wide`}>
                  Today
                </p>
              </div>
              <div className={`divide-y ${dividerColor}`}>
                {today.map((notification) => {
                  const IconComponent = getIconComponent(notification.iconName);
                  return (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`w-full px-4 py-3 ${bgHover} transition-colors text-left active:opacity-80`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${notification.color}15` }}
                        >
                          <IconComponent 
                            className="w-5 h-5" 
                            style={{ color: notification.color }} 
                            strokeWidth={2.5}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2 mb-0.5">
                            <h3 className={`text-[15px] font-semibold ${textPrimary} tracking-tight`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className={`text-[13px] ${textSecondary}`}>{notification.time}</span>
                              {!notification.read && (
                                <div className={`w-2 h-2 ${unreadDot} rounded-full`}></div>
                              )}
                            </div>
                          </div>
                          <p className={`text-[15px] ${textSecondary} leading-[20px] tracking-tight`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Earlier Section */}
          {earlier.length > 0 && (
            <>
              <div className="px-4 pt-4 pb-2">
                <p className={`text-[13px] font-semibold ${textSecondary} uppercase tracking-wide`}>
                  Earlier
                </p>
              </div>
              <div className={`divide-y ${dividerColor}`}>
                {earlier.map((notification) => {
                  const IconComponent = getIconComponent(notification.iconName);
                  return (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`w-full px-4 py-3 ${bgHover} transition-colors text-left active:opacity-80`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${notification.color}15` }}
                        >
                          <IconComponent 
                            className="w-5 h-5" 
                            style={{ color: notification.color }} 
                            strokeWidth={2.5}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2 mb-0.5">
                            <h3 className={`text-[15px] font-semibold ${textPrimary} tracking-tight`}>
                              {notification.title}
                            </h3>
                            <span className={`text-[13px] ${textSecondary} flex-shrink-0`}>
                              {notification.time}
                            </span>
                          </div>
                          <p className={`text-[15px] ${textSecondary} leading-[20px] tracking-tight`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Clear All Button */}
          {notifications.length > 0 && (
            <div className="px-4 pt-6 pb-4">
              <button
                onClick={clearAll}
                className="w-full py-3 text-[#FF453A] text-[15px] font-medium hover:bg-[#FF453A]/10 rounded-xl transition-colors"
              >
                Clear All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
