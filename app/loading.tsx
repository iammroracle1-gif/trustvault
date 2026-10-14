export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0F1018] flex items-center justify-center">
      <div className="text-center">
        {/* Trust Vault Logo/Icon */}
        <div className="w-16 h-16 bg-[#4938F5] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-white text-lg font-semibold mb-2">Trust Vault</h2>
        <p className="text-[#8E8E93] text-sm">Loading your wallet...</p>
        
        {/* Loading Spinner */}
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#4938F5]/30 border-t-[#4938F5] rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
