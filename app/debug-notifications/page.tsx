"use client";

import { useState } from "react";

export default function DebugNotificationsPage() {
  const [walletId, setWalletId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkDeposits = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test-notifications?walletId=${walletId}`);
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error?.message || 'Unknown error' });
    }
    setLoading(false);
  };

  const checkPendingNotifications = async () => {
    setLoading(true);
    try {
      const lastCheck = localStorage.getItem('last_notification_check') || '0';
      const response = await fetch(`/api/user/pending-notifications?walletId=${walletId}&lastCheck=${lastCheck}`);
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error?.message || 'Unknown error' });
    }
    setLoading(false);
  };

  const checkLocalStorage = () => {
    const data = {
      wallet_id: localStorage.getItem('wallet_id'),
      wallet_email: localStorage.getItem('wallet_email'),
      last_notification_check: localStorage.getItem('last_notification_check'),
      notifications: JSON.parse(localStorage.getItem('notifications') || '[]'),
      recentActivity: JSON.parse(localStorage.getItem('recentActivity') || '[]'),
    };
    setResult(data);
  };

  const resetLastCheck = () => {
    localStorage.setItem('last_notification_check', '0');
    alert('Last check reset to 0. Refresh dashboard to fetch all notifications.');
  };

  return (
    <div className="min-h-screen bg-[#0F1018] p-6">
      <h1 className="text-white text-2xl font-bold mb-6">Debug Notifications</h1>

      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="text-white block mb-2">Wallet ID:</label>
          <input
            type="text"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            className="w-full px-4 py-2 bg-[#1C1C1E] text-white rounded-lg"
            placeholder="Enter wallet ID or leave empty to use localStorage"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              const id = walletId || localStorage.getItem('wallet_id');
              setWalletId(id || '');
              if (id) checkDeposits();
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Check Deposit Requests
          </button>

          <button
            onClick={() => {
              const id = walletId || localStorage.getItem('wallet_id');
              setWalletId(id || '');
              if (id) checkPendingNotifications();
            }}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            Check Pending Notifications
          </button>

          <button
            onClick={checkLocalStorage}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Check localStorage
          </button>

          <button
            onClick={resetLastCheck}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Reset Last Check
          </button>
        </div>

        {loading && (
          <div className="text-white">Loading...</div>
        )}

        {result && (
          <div className="bg-[#1C1C1E] p-4 rounded-lg">
            <h2 className="text-white font-bold mb-2">Result:</h2>
            <pre className="text-[#34C759] text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 text-[#8E8E93] text-sm space-y-2">
        <p><strong>Instructions:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Leave Wallet ID empty to use logged-in user's wallet</li>
          <li>Click "Check Deposit Requests" to see all deposits in database</li>
          <li>Click "Check Pending Notifications" to see what API returns</li>
          <li>Click "Check localStorage" to see what's saved locally</li>
          <li>Click "Reset Last Check" to force fetch all notifications</li>
        </ol>
      </div>
    </div>
  );
}
