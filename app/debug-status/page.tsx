"use client";

import { useState, useEffect } from "react";

export default function DebugStatusPage() {
  const [walletId, setWalletId] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('wallet_id');
    if (id) {
      setWalletId(id);
    }
  }, []);

  const checkStatus = async () => {
    if (!walletId) {
      setResult({ error: 'No wallet_id in localStorage' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/user/check-status?walletId=${walletId}`);
      const data = await response.json();
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data
      });
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const checkFromInput = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user/check-status?walletId=${walletId}`);
      const data = await response.json();
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data
      });
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F1018] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-6">Debug Status Check</h1>

        {/* localStorage info */}
        <div className="bg-[#1C1C1E] rounded-2xl p-6 mb-6">
          <h2 className="text-white text-xl font-bold mb-4">LocalStorage</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-[#8E8E93]">wallet_id:</span>
              <span className="text-white ml-2">{localStorage.getItem('wallet_id') || 'null'}</span>
            </div>
            <div>
              <span className="text-[#8E8E93]">wallet_address:</span>
              <span className="text-white ml-2">{localStorage.getItem('wallet_address') || 'null'}</span>
            </div>
            <div>
              <span className="text-[#8E8E93]">wallet_email:</span>
              <span className="text-white ml-2">{localStorage.getItem('wallet_email') || 'null'}</span>
            </div>
          </div>
        </div>

        {/* Manual Check */}
        <div className="bg-[#1C1C1E] rounded-2xl p-6 mb-6">
          <h2 className="text-white text-xl font-bold mb-4">Manual Status Check</h2>
          
          <div className="mb-4">
            <label className="text-[#8E8E93] block mb-2">Wallet ID:</label>
            <input
              type="text"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full px-4 py-2 bg-[#2C2C2E] text-white rounded-lg font-mono text-sm"
              placeholder="Enter wallet_id"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={checkStatus}
              disabled={loading || !walletId}
              className="px-6 py-3 bg-[#4938F5] text-white rounded-lg hover:bg-[#5D4EFF] disabled:opacity-50 font-semibold"
            >
              {loading ? 'Checking...' : 'Check Status (from localStorage)'}
            </button>

            <button
              onClick={checkFromInput}
              disabled={loading || !walletId}
              className="px-6 py-3 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Checking...' : 'Check Status (from input)'}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-[#1C1C1E] rounded-2xl p-6">
            <h2 className="text-white text-xl font-bold mb-4">API Response</h2>
            <pre className="text-white text-sm overflow-auto p-4 bg-black/30 rounded-lg">
              {JSON.stringify(result, null, 2)}
            </pre>

            {/* Analysis */}
            {result.data && (
              <div className="mt-4 p-4 bg-[#2C2C2E] rounded-lg">
                <h3 className="text-white font-bold mb-2">Analysis:</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-[#8E8E93]">Success:</span>
                    <span className="text-white ml-2">{result.data.success ? '✅ Yes' : '❌ No'}</span>
                  </div>
                  <div>
                    <span className="text-[#8E8E93]">Account Deleted:</span>
                    <span className="text-white ml-2">{result.data.accountDeleted ? '❌ Yes' : '✅ No'}</span>
                  </div>
                  <div>
                    <span className="text-[#8E8E93]">Status:</span>
                    <span className={`ml-2 font-bold ${
                      result.data.status === 'unregistered' ? 'text-yellow-400' :
                      result.data.status === 'active' ? 'text-green-400' :
                      'text-red-400'
                    }`}>
                      {result.data.status || 'unknown'}
                    </span>
                  </div>
                  {result.data.error && (
                    <div>
                      <span className="text-[#8E8E93]">Error:</span>
                      <span className="text-red-400 ml-2">{result.data.error}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-black/30 rounded-lg">
                  <p className="text-[#8E8E93] text-xs mb-2">What this means:</p>
                  {result.data.status === 'unregistered' && (
                    <p className="text-yellow-400 text-sm">
                      ✅ Wallet imported but email not registered yet. This is NORMAL and should NOT show "account removed" error.
                    </p>
                  )}
                  {result.data.status === 'active' && (
                    <p className="text-green-400 text-sm">
                      ✅ Account is active and working normally.
                    </p>
                  )}
                  {(result.data.status === 'deleted' || result.data.status === 'suspended') && (
                    <p className="text-red-400 text-sm">
                      ❌ Account was deleted/suspended by admin. This SHOULD show "account removed" error.
                    </p>
                  )}
                  {!result.data.success && result.data.error && (
                    <p className="text-red-400 text-sm">
                      ❌ API returned an error. This might cause the "account removed" alert.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
