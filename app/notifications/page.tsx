"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ArrowUpRight, TrendingUp, Shield, Sparkles, ArrowDownLeft } from "lucide-react";

interface Notification {
  id: string;
  type: "transaction" | "price" | "news" | "security";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
  color: string;
  timestamp: number;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
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
            icon: Shield,
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
            icon: Sparkles,
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

  return (
    <div className="min-h-screen bg-[#0F1018]">
      {/* Header - Clean iOS */}
      <div className="sticky top-0 bg-[#0F1018]/95 backdrop-blur-xl z-10 border-b border-white/5">
        <div className="flex items-center px-4 h-11">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 -ml-1 hover:opacity-70 transition-opacity active:scale-95"
          >
            <ArrowLeft className="w-[22px] h-[22px] text-white" strokeWidth={2.5} />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-semibold text-white tracking-tight -ml-6">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[13px] text-white font-medium hover:opacity-70"
            >
              Read All
            </button>
          )}
        </div>
      </div>

      {/* Unread Badge - Modern iOS style */}
      {unreadCount > 0 && (
        <div className="px-4 py-3 bg-white/5 border-b border-white/10">
          <p className="text-[13px] text-white font-medium text-center">
            {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Notifications List - Modern clean */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-3">
            <Check className="w-7 h-7 text-[#8E8E93]" strokeWidth={2} />
          </div>
          <p className="text-[17px] font-semibold text-white mb-1">
            No Notifications
          </p>
          <p className="text-[15px] text-[#8E8E93]">
            You're all caught up
          </p>
        </div>
      ) : (
        <div>
          {/* Today Section */}
          {today.length > 0 && (
            <>
              <div className="px-4 pt-4 pb-2">
                <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">
                  Today
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {today.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left active:bg-white/10"
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
                            <h3 className="text-[15px] font-semibold text-white tracking-tight">
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className="text-[13px] text-[#8E8E93]">{notification.time}</span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-[15px] text-[#8E8E93] leading-[20px] tracking-tight">
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
                <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">
                  Earlier
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {earlier.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left active:bg-white/10"
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
                            <h3 className="text-[15px] font-semibold text-white tracking-tight">
                              {notification.title}
                            </h3>
                            <span className="text-[13px] text-[#8E8E93] flex-shrink-0">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-[15px] text-[#8E8E93] leading-[20px] tracking-tight">
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
