"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Copy, Send, ArrowDownToLine, Settings, Bell, Check } from "lucide-react";
import ReceiveModal from "@/components/ReceiveModal";
import SendModal from "@/components/SendModal";
import WalletModal from "@/components/WalletModal";
import CustomizeWalletModal from "@/components/CustomizeWalletModal";
import BottomNav from "@/components/BottomNav";
import RestrictionWarning from "@/components/RestrictionWarning";
import { WalletIcons } from "@/components/WalletIcons";
import { fetchMarketTickers, formatPrice, type MarketTicker } from "@/lib/market-api";
import { getEthereumBalance } from "@/lib/api/ethereum";
import { formatCurrency, shortenAddress, formatPercentage } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface Transaction {
  id: string;
  type: string;
  asset: string;
  amount: string;
  time: string;
  status: string;
  address?: string;
}

interface Wallet {
  id: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fullAddress = searchParams?.get("address") || "0x742d35Ec3B1B4E5C19e8Ba7a1A2c6fAd4Be4a2f";
  const address = shortenAddress(fullAddress);
  const { theme } = useTheme();
  
  const [showReceive, setShowReceive] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [cryptoAssets, setCryptoAssets] = useState<MarketTicker[]>([]);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [recentActivity, setRecentActivity] = useState<Transaction[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: "wallet-1",
      name: "Wallet 1",
      icon: "wallet",
      color: "#B967FF",
      isActive: true,
    },
  ]);

  // Fetch balance from database
  const fetchBalance = async () => {
    try {
      const walletId = localStorage.getItem('wallet_id');
      console.log('🔍 Fetching balance for wallet ID:', walletId);
      
      if (!walletId) {
        console.warn('⚠️ No wallet ID found in localStorage');
        return;
      }

      const response = await fetch(`/api/user/balance?walletId=${walletId}`);
      const data = await response.json();

      console.log('💰 Balance API response:', data);

      if (data.success && typeof data.balance === 'number') {
        setTotalBalance(data.balance);
        // Update localStorage to keep it in sync
        localStorage.setItem('balance', data.balance.toString());
        console.log('✅ Balance synced from database:', data.balance);
      } else {
        console.error('❌ Failed to fetch balance:', data.error);
      }
    } catch (error) {
      console.error('❌ Balance fetch error:', error);
      // Fallback to localStorage if API fails
      const savedBalance = localStorage.getItem('balance');
      if (savedBalance) {
        setTotalBalance(parseFloat(savedBalance));
        console.log('📦 Using localStorage balance:', savedBalance);
      }
    }
  };

  // Load wallets from localStorage on mount
  useEffect(() => {
    // Debug: Show wallet info
    const walletId = localStorage.getItem('wallet_id');
    const walletEmail = localStorage.getItem('wallet_email');
    const sessionWalletId = sessionStorage.getItem('wallet_id');
    
    console.log('🔍 Wallet Info on Dashboard:');
    console.log('  - localStorage wallet_id:', walletId);
    console.log('  - localStorage email:', walletEmail);
    console.log('  - sessionStorage wallet_id:', sessionWalletId);
    
    if (!walletId && sessionWalletId) {
      console.log('⚠️ wallet_id only in sessionStorage, copying to localStorage');
      localStorage.setItem('wallet_id', sessionWalletId);
      const email = sessionStorage.getItem('wallet_email');
      if (email) localStorage.setItem('wallet_email', email);
    }
    
    // Load recent activity
    loadRecentActivity();
    loadUnreadNotifications();
    
    // Fetch balance from database
    fetchBalance();
    
    // Set up periodic balance sync (every 5 seconds)
    const balanceInterval = setInterval(fetchBalance, 5000);
    
    // Check if there's a newly customized wallet from creation flow
    const walletName = sessionStorage.getItem("wallet_name");
    const walletIcon = sessionStorage.getItem("wallet_icon");
    const walletColor = sessionStorage.getItem("wallet_color");
    const walletAddress = sessionStorage.getItem("wallet_address");
    
    if (walletName && walletIcon && walletColor && walletAddress) {
      // Create wallet with customization - Type assertion since we checked for null above
      const newWallet: Wallet = {
        id: `wallet-${Date.now()}`,
        name: walletName as string,
        icon: walletIcon as string,
        color: walletColor as string,
        isActive: true,
      };
      
      const savedWallets = localStorage.getItem("vaultora_wallets");
      let existingWallets: Wallet[] = [];
      
      if (savedWallets) {
        try {
          existingWallets = JSON.parse(savedWallets as string);
          // Set all other wallets to inactive
          existingWallets = existingWallets.map(w => ({ ...w, isActive: false }));
        } catch (error) {
          console.error("Error parsing wallets:", error);
        }
      }
      
      // Add new wallet and save
      const updatedWallets = [...existingWallets, newWallet];
      setWallets(updatedWallets);
      localStorage.setItem("vaultora_wallets", JSON.stringify(updatedWallets));
      
      // Clear session storage
      sessionStorage.removeItem("wallet_name");
      sessionStorage.removeItem("wallet_icon");
      sessionStorage.removeItem("wallet_color");
      
      console.log("✅ Wallet customization applied:", newWallet);
    } else {
      // Load existing wallets from localStorage if no new customization
      const savedWallets = localStorage.getItem("vaultora_wallets");
      if (savedWallets) {
        try {
          const parsed = JSON.parse(savedWallets as string);
          if (parsed && parsed.length > 0) {
            setWallets(parsed);
          }
        } catch (error) {
          console.error("Error loading wallets:", error);
        }
      }
    }

    // Cleanup interval on unmount
    return () => clearInterval(balanceInterval);
  }, []);

  useEffect(() => {
    loadData();
  }, [fullAddress]);

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Fetch from unified CoinPaprika API
      console.log("Fetching crypto prices from CoinPaprika...");
      const response = await fetchMarketTickers(1, 10); // Get top 10
      
      if (response.success) {
        setCryptoAssets(response.data);
        console.log("✅ Crypto assets loaded:", response.data.length);
      } else {
        console.error("Failed to load crypto assets:", response.error);
      }
    } catch (error) {
      console.error("Error loading crypto data:", error);
    }

    // Fetch real ETH balance if valid address (optional - Alchemy needed)
    if (fullAddress.startsWith("0x")) {
      try {
        const balance = await getEthereumBalance(fullAddress);
        setEthBalance(balance);
      } catch (error) {
        console.log("ETH balance fetch skipped (Alchemy not configured)");
      }
    }

    setLoading(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const loadRecentActivity = () => {
    try {
      const saved = localStorage.getItem('recentActivity');
      if (saved) {
        setRecentActivity(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    }
  };

  const loadUnreadNotifications = () => {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const notifications = JSON.parse(saved);
        const unread = notifications.filter((n: any) => !n.read).length;
        setUnreadNotifications(unread);
      }
    } catch (error) {
      setUnreadNotifications(0);
    }
  };

  const addToRecentActivity = (transaction: Transaction) => {
    try {
      let activity = recentActivity;
      activity.unshift(transaction);
      activity = activity.slice(0, 10); // Keep only 10 most recent
      setRecentActivity(activity);
      localStorage.setItem('recentActivity', JSON.stringify(activity));
    } catch (error) {
      console.error('Failed to save recent activity:', error);
    }
  };

  const handleImageError = (symbol: string) => {
    setImageErrors(prev => ({ ...prev, [symbol]: true }));
  };

  const handleAddWallet = () => {
    setShowWalletModal(false);
    setEditingWalletId(null);
    setTimeout(() => setShowCustomizeModal(true), 200);
  };

  const handleEditWallet = (walletId: string) => {
    setShowWalletModal(false);
    setEditingWalletId(walletId);
    setTimeout(() => setShowCustomizeModal(true), 200);
  };

  const handleSaveWallet = (newWallet: { name: string; icon: string; color: string }) => {
    if (editingWalletId) {
      // Update existing wallet
      const updatedWallets = wallets.map((w) =>
        w.id === editingWalletId
          ? { ...w, name: newWallet.name, icon: newWallet.icon, color: newWallet.color }
          : w
      );
      setWallets(updatedWallets);
      localStorage.setItem("vaultora_wallets", JSON.stringify(updatedWallets));
      setEditingWalletId(null);
    } else {
      // Add new wallet
      const wallet: Wallet = {
        id: `wallet-${Date.now()}`,
        ...newWallet,
        isActive: false,
      };
      const updatedWallets = [...wallets, wallet];
      setWallets(updatedWallets);
      localStorage.setItem("vaultora_wallets", JSON.stringify(updatedWallets));
    }
    setShowCustomizeModal(false);
  };

  const handleSelectWallet = (walletId: string) => {
    const updatedWallets = wallets.map((w) => ({
      ...w,
      isActive: w.id === walletId,
    }));
    setWallets(updatedWallets);
    // Persist to localStorage
    localStorage.setItem("vaultora_wallets", JSON.stringify(updatedWallets));
    setShowWalletModal(false);
  };

  const activeWallet = wallets.find((w) => w.isActive) || wallets[0];

  // Theme-aware colors
  const bgPrimary = theme === 'dark' ? 'bg-[#0F1018]' : 'bg-[#F5F5F7]';
  const bgSecondary = theme === 'dark' ? 'bg-[#191C2A]' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-[#8E8E93]' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-[#303344]' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgPrimary} pb-20`}>
      {/* Header */}
      <div className={`px-6 py-6 ${bgSecondary} border-b ${borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowWalletModal(true)}
            className={`flex items-center gap-3 ${theme === 'dark' ? 'hover:bg-[#202437]' : 'hover:bg-gray-100'} px-3 py-2 -ml-3 rounded-xl transition-colors`}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: activeWallet.color }}
            >
              <div className="w-6 h-6 text-white">
                {WalletIcons[activeWallet.icon as keyof typeof WalletIcons] || WalletIcons.wallet}
              </div>
            </div>
            <div className="text-left">
              <p className={`text-xs ${textSecondary}`}>Wallet</p>
              <p className={`${textPrimary} font-medium text-sm`}>{activeWallet.name}</p>
            </div>
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push("/notifications")}
              className={`p-2 ${theme === 'dark' ? 'hover:bg-[#202437]' : 'hover:bg-gray-100'} rounded-lg transition-colors relative`}
            >
              <Bell className={`w-5 h-5 ${textPrimary}`} />
              {/* Notification badge - only show if there are unread */}
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-[#FF453A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
            </button>
            <button 
              onClick={() => router.push("/settings")}
              className={`p-2 ${theme === 'dark' ? 'hover:bg-[#202437]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
            >
              <Settings className={`w-5 h-5 ${textPrimary}`} />
            </button>
          </div>
        </div>

        {/* Total Balance */}
        <div className="text-center py-8">
          <p className={`text-xs ${textSecondary} mb-3`}>Total Balance</p>
          {loading ? (
            <div className="animate-pulse">
              <div className={`h-12 w-56 ${theme === 'dark' ? 'bg-[#202437]' : 'bg-gray-200'} rounded mx-auto mb-2`} />
            </div>
          ) : (
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSend(true)}
            className={`flex-1 py-3 ${theme === 'dark' ? 'bg-[#4938F5] hover:bg-[#3D2DD4]' : 'bg-[#4938F5] hover:bg-[#3D2DD4]'} text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors`}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
          <button 
            onClick={() => router.push('/deposit')}
            className={`flex-1 py-3 ${theme === 'dark' ? 'bg-[#202437] hover:bg-[#303344]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            Receive
          </button>
        </div>
      </div>

      {/* Restriction Warning - Real-time */}
      <RestrictionWarning />

      {/* Markets Section - Live Prices */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${textPrimary}`}>Markets</h2>
          <button 
            onClick={() => router.push("/markets")}
            className="text-sm text-[#4938F5] hover:text-[#3D2DD4]"
          >
            See All
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-16 ${theme === 'dark' ? 'bg-[#191C2A]' : 'bg-white'} rounded-xl`} />
              ))}
            </div>
          ) : (
            <>
              {cryptoAssets.slice(0, 3).map((asset) => (
                <div 
                  key={asset.id}
                  className={`p-4 ${bgSecondary} ${theme === 'dark' ? 'hover:bg-[#202437]' : 'hover:bg-gray-50'} rounded-xl cursor-pointer transition-colors`}
                  onClick={() => router.push(`/asset/${asset.symbol}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Real crypto icon */}
                      <img
                        src={`https://cryptologos.cc/logos/${asset.name.toLowerCase().replace(/\s+/g, '-')}-${asset.symbol.toLowerCase()}-logo.png`}
                        alt={asset.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          // Fallback to CoinGecko API
                          const target = e.target as HTMLImageElement;
                          target.src = `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`;
                          target.onerror = () => {
                            // Final fallback to letter icon
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-10 h-10 rounded-full bg-[#4938F5]/20 flex items-center justify-center"><span class="text-[#4938F5] font-bold text-[15px]">${asset.symbol.charAt(0)}</span></div>`;
                            }
                          };
                        }}
                      />
                      <div>
                        <p className={`font-semibold ${textPrimary} text-[15px]`}>{asset.symbol}</p>
                        <p className={`text-[13px] ${textSecondary}`}>{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${textPrimary} text-[15px]`}>
                        {formatPrice(asset.price)}
                      </p>
                      <p className={`text-[13px] font-medium ${
                        asset.percentChange24h > 0 ? "text-[#34C759]" : "text-[#FF453A]"
                      }`}>
                        {asset.percentChange24h > 0 ? "+" : ""}
                        {asset.percentChange24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${textPrimary}`}>Recent Activity</h2>
          <button 
            onClick={() => router.push("/notifications")}
            className="text-sm text-[#4938F5] hover:text-[#3D2DD4]"
          >
            View All
          </button>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <Send className={`w-7 h-7 ${textSecondary}`} />
            </div>
            <p className={`${textPrimary} text-[17px] font-semibold mb-1`}>No Recent Activity</p>
            <p className={`${textSecondary} text-[15px]`}>
              Your transactions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.slice(0, 3).map((tx) => (
              <div
                key={tx.id}
                className={`p-4 ${bgSecondary} ${theme === 'dark' ? 'hover:bg-[#202437]' : 'hover:bg-gray-50'} rounded-xl cursor-pointer transition-colors`}
                onClick={() => router.push("/notifications")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${textPrimary} text-[15px]`}>{tx.type}</p>
                    <p className={`text-[13px] ${textSecondary} mt-0.5`}>{tx.time}</p>
                    {tx.address && (
                      <p className={`text-[13px] ${textSecondary} mt-0.5`}>
                        {tx.type === "Received" ? "From" : "To"}: {shortenAddress(tx.address)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-[15px] ${
                        tx.amount.startsWith("+")
                          ? "text-[#34C759]"
                          : textPrimary
                      }`}
                    >
                      {tx.amount} {tx.asset}
                    </p>
                    <p className={`text-[13px] ${textSecondary} mt-0.5`}>{tx.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation - Glass Morphism Style */}
      <BottomNav />

      {/* Send Modal */}
      {showSend && (
        <SendModal
          balance={totalBalance}
          onClose={() => setShowSend(false)}
        />
      )}

      {/* Receive Modal */}
      {showReceive && (
        <ReceiveModal
          address={fullAddress}
          onClose={() => setShowReceive(false)}
        />
      )}

      {/* Wallet Management Modal */}
      {showWalletModal && (
        <WalletModal
          wallets={wallets}
          onClose={() => setShowWalletModal(false)}
          onAddWallet={handleAddWallet}
          onSelectWallet={handleSelectWallet}
          onEditWallet={handleEditWallet}
        />
      )}

      {/* Customize Wallet Modal */}
      {showCustomizeModal && (
        <CustomizeWalletModal
          onClose={() => {
            setShowCustomizeModal(false);
            setEditingWalletId(null);
          }}
          onSave={handleSaveWallet}
          editingWallet={editingWalletId ? wallets.find(w => w.id === editingWalletId) : undefined}
        />
      )}
    </div>
  );
}


export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F1018] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
