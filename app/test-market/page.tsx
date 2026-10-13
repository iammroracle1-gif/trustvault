"use client";

import { useState, useEffect } from 'react';
import { fetchMarketTickers, formatPrice, formatLargeNumber, formatPercentChange, MarketResponse } from '@/lib/market-api';

export default function TestMarketPage() {
  const [marketData, setMarketData] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadMarketData = async () => {
    setLoading(true);
    const data = await fetchMarketTickers(page, 20, search);
    setMarketData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMarketData();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    loadMarketData();
  };

  return (
    <div className="min-h-screen bg-[#0F1018] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-2">Market Data Test</h1>
        <p className="text-[#8E8E93] text-sm mb-6">Testing CoinPaprika API Integration</p>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search coins..."
            className="flex-1 px-4 py-2 bg-[#1C1C1E] text-white rounded-lg border border-white/10 focus:outline-none focus:border-[#4938F5]"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-[#4938F5] text-white rounded-lg hover:bg-[#5D4EFF] transition-colors"
          >
            Search
          </button>
          <button
            onClick={loadMarketData}
            className="px-6 py-2 bg-[#2C2C2E] text-white rounded-lg hover:bg-[#3C3C3E] transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Status */}
        {marketData && (
          <div className="mb-4 p-4 bg-[#1C1C1E] rounded-lg border border-white/10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#8E8E93]">Status: </span>
                <span className={marketData.success ? 'text-[#34C759]' : 'text-[#FF453A]'}>
                  {marketData.success ? '✓ Connected' : '✗ Error'}
                </span>
              </div>
              <div>
                <span className="text-[#8E8E93]">Provider: </span>
                <span className="text-white">{marketData.provider}</span>
              </div>
              <div>
                <span className="text-[#8E8E93]">Cached: </span>
                <span className="text-white">{marketData.cache.cached ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-[#8E8E93]">Last Update: </span>
                <span className="text-white">
                  {marketData.cache.lastUpdate 
                    ? new Date(marketData.cache.lastUpdate).toLocaleTimeString()
                    : 'Never'}
                </span>
              </div>
              {marketData.error && (
                <div className="col-span-2">
                  <span className="text-[#FF453A]">Error: {marketData.error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#4938F5] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#8E8E93] mt-4">Loading market data...</p>
          </div>
        )}

        {/* Error */}
        {!loading && marketData && !marketData.success && (
          <div className="text-center py-12">
            <p className="text-[#FF453A] text-lg mb-2">Failed to load market data</p>
            <p className="text-[#8E8E93] text-sm">{marketData.error}</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && marketData && marketData.success && (
          <>
            <div className="bg-[#1C1C1E] rounded-lg border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-[#8E8E93] text-sm font-medium">#</th>
                    <th className="px-4 py-3 text-left text-[#8E8E93] text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-right text-[#8E8E93] text-sm font-medium">Price</th>
                    <th className="px-4 py-3 text-right text-[#8E8E93] text-sm font-medium">24h %</th>
                    <th className="px-4 py-3 text-right text-[#8E8E93] text-sm font-medium">Volume</th>
                    <th className="px-4 py-3 text-right text-[#8E8E93] text-sm font-medium">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.data.map((coin) => (
                    <tr key={coin.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-[#8E8E93] text-sm">{coin.rank}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{coin.symbol}</span>
                          <span className="text-[#8E8E93] text-sm">{coin.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-white font-medium">
                        {formatPrice(coin.price)}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        coin.percentChange24h > 0 ? 'text-[#34C759]' : 'text-[#FF453A]'
                      }`}>
                        {formatPercentChange(coin.percentChange24h)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#8E8E93] text-sm">
                        {formatLargeNumber(coin.volume24h)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#8E8E93] text-sm">
                        {formatLargeNumber(coin.marketCap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[#8E8E93] text-sm">
                Showing {marketData.data.length} of {marketData.pagination.total} coins
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-[#2C2C2E] text-white rounded-lg hover:bg-[#3C3C3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-white">
                  Page {page} of {marketData.pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(marketData.pagination.totalPages, page + 1))}
                  disabled={page === marketData.pagination.totalPages}
                  className="px-4 py-2 bg-[#2C2C2E] text-white rounded-lg hover:bg-[#3C3C3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
