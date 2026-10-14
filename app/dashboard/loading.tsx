export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0F1018]">
      {/* Header Skeleton */}
      <div className="px-6 py-6 bg-[#191C2A] border-b border-[#303344]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#202437] animate-pulse" />
            <div>
              <div className="h-3 w-12 bg-[#202437] rounded animate-pulse mb-2" />
              <div className="h-4 w-20 bg-[#202437] rounded animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-9 h-9 bg-[#202437] rounded-lg animate-pulse" />
            <div className="w-9 h-9 bg-[#202437] rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Balance Skeleton */}
        <div className="text-center py-8">
          <div className="h-3 w-24 bg-[#202437] rounded mx-auto mb-3 animate-pulse" />
          <div className="h-12 w-56 bg-[#202437] rounded mx-auto mb-2 animate-pulse" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-[#4938F5]/20 rounded-xl animate-pulse" />
          <div className="flex-1 h-12 bg-[#202437] rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Markets Section Skeleton */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-20 bg-[#191C2A] rounded animate-pulse" />
          <div className="h-4 w-16 bg-[#191C2A] rounded animate-pulse" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-[#191C2A] rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#202437] animate-pulse" />
                  <div>
                    <div className="h-4 w-16 bg-[#202437] rounded mb-2 animate-pulse" />
                    <div className="h-3 w-24 bg-[#202437] rounded animate-pulse" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-20 bg-[#202437] rounded mb-2 animate-pulse ml-auto" />
                  <div className="h-3 w-16 bg-[#202437] rounded animate-pulse ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
