"use client";

import { useState, useEffect } from "react";
import { RefreshCw, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import TopNav from "@/components/TopNav";

export default function MarketDiagnosticsPage() {
  const [btcDebug, setBtcDebug] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      // Fetch BTC debug info
      const debugRes = await fetch('/api/market/debug-btc', { cache: 'no-store' });
      const debugData = await debugRes.json();
      setBtcDebug(debugData);

      // Fetch comparison
      const compRes = await fetch('/api/market/compare-sources', { cache: 'no-store' });
      const compData = await compRes.json();
      setComparison(compData);
    } catch (error) {
      console.error('Diagnostic fetch error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1018] pb-20">
      <TopNav title="Market Diagnostics" showBack />

      <div className="px-4 pt-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-white text-[22px] font-bold mb-2">BTC Price Investigation</h1>
          <p className="text-[#8E8E93] text-[15px]">
            Investigating price discrepancy between Trust Vault and Trust Wallet
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchDiagnostics}
          disabled={loading}
          className="w-full mb-4 px-4 py-3 bg-[#4938F5] hover:bg-[#5D4EFF] disabled:opacity-50 text-white rounded-xl flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="font-semibold">{loading ? 'Fetching...' : 'Refresh Data'}</span>
        </button>

        {/* Price Comparison */}
        {comparison && (
          <div className="bg-[#1C1C1E] rounded-2xl p-5 mb-4 border border-white/10">
            <h2 className="text-white text-[17px] font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4938F5]" />
              Live Price Comparison
            </h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[#8E8E93] text-[15px]">Trust Wallet Displayed</span>
                <span className="text-white text-[17px] font-bold">
                  ${comparison.comparison.trustWalletDisplayed.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[#8E8E93] text-[15px]">Our App Displayed</span>
                <span className="text-white text-[17px] font-bold">
                  ${comparison.comparison.ourAppDisplayed.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[#8E8E93] text-[15px]">CoinPaprika Live</span>
                <span className="text-[#34C759] text-[17px] font-bold">
                  ${comparison.comparison.coinPaprikaLive?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[#8E8E93] text-[15px]">CoinGecko Live</span>
                <span className="text-[#34C759] text-[17px] font-bold">
                  ${comparison.comparison.coinGeckoLive?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8E8E93] text-[15px]">Binance Live</span>
                <span className="text-[#34C759] text-[17px] font-bold">
                  ${comparison.comparison.binanceLive?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-[#4938F5]/10 border border-[#4938F5]/20 rounded-xl p-3">
              <p className="text-[#4938F5] text-[13px] font-medium">
                Average: ${comparison.analysis.averagePrice}
              </p>
              <p className="text-[#8E8E93] text-[12px] mt-1">
                Max difference between sources: ${comparison.analysis.maxDifference}
              </p>
            </div>
          </div>
        )}

        {/* Source Details */}
        {comparison && (
          <div className="bg-[#1C1C1E] rounded-2xl p-5 mb-4 border border-white/10">
            <h2 className="text-white text-[17px] font-bold mb-4">API Sources</h2>
            
            {Object.entries(comparison.sources).map(([name, data]: [string, any]) => (
              <div key={name} className="mb-4 pb-4 border-b border-white/5 last:border-0 last:pb-0 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-[15px] font-semibold capitalize">{name}</span>
                  <span className="text-[#34C759] text-[13px]">{data.responseTime}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[#8E8E93] text-[13px]">
                    Price: <span className="text-white">${data.price?.toLocaleString()}</span>
                  </p>
                  <p className="text-[#8E8E93] text-[13px]">
                    Currency: <span className="text-white">{data.currency}</span>
                  </p>
                  {data.percentChange24h && (
                    <p className="text-[#8E8E93] text-[13px]">
                      24h Change: <span className={data.percentChange24h > 0 ? 'text-[#34C759]' : 'text-[#FF453A]'}>
                        {data.percentChange24h > 0 ? '+' : ''}{data.percentChange24h.toFixed(2)}%
                      </span>
                    </p>
                  )}
                  <p className="text-[#8E8E93] text-[11px] break-all">
                    {data.endpoint}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Findings */}
        {comparison && (
          <div className="bg-[#191C2A] rounded-2xl p-5 border border-[#34C759]/20">
            <h2 className="text-white text-[17px] font-bold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#34C759]" />
              Findings
            </h2>
            
            <div className="mb-3">
              <p className="text-[#8E8E93] text-[13px] mb-2">{comparison.findings.note}</p>
              <ul className="space-y-1.5">
                {comparison.findings.reasons.map((reason: string, i: number) => (
                  <li key={i} className="text-[#8E8E93] text-[13px]">{reason}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#34C759]/10 border border-[#34C759]/20 rounded-xl p-3">
              <p className="text-[#34C759] text-[13px] font-medium">
                {comparison.findings.recommendation}
              </p>
            </div>
          </div>
        )}

        {/* Timestamp */}
        {comparison && (
          <div className="mt-4 text-center">
            <p className="text-[#8E8E93] text-[11px]">
              Last updated: {new Date(comparison.timestamp).toLocaleString()}
            </p>
            <p className="text-[#8E8E93] text-[11px]">
              Response time: {comparison.totalResponseTime}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
