"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, TrendingUp, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  
  const navItems = [
    { id: "home", icon: Home, path: "/dashboard", label: "Home" },
    { id: "markets", icon: TrendingUp, path: "/markets", label: "Markets" },
    { 
      id: "perps", 
      icon: () => (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 12c0-1.5 1.5-3 3.5-3 1.5 0 2.5.5 3.5 2 1-1.5 2-2 3.5-2 2 0 3.5 1.5 3.5 3s-1.5 3-3.5 3c-1.5 0-2.5-.5-3.5-2-1 1.5-2 2-3.5 2-2 0-3.5-1.5-3.5-3z" />
        </svg>
      ), 
      path: "/perps", 
      label: "Perps" 
    },
  ];

  // Get current index from pathname - this is the source of truth
  const getCurrentIndex = () => {
    const index = navItems.findIndex(item => item.path === pathname);
    return index !== -1 ? index : 0;
  };

  const [activeIndex, setActiveIndex] = useState(getCurrentIndex);
  const [mounted, setMounted] = useState(false);

  // Update active index when pathname changes
  useEffect(() => {
    const newIndex = getCurrentIndex();
    setActiveIndex(newIndex);
    
    // Mark as mounted after first render
    if (!mounted) {
      setMounted(true);
    }
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  // Button dimensions
  const buttonWidth = 52; // w-[52px]
  const buttonGap = 4; // gap-1 = 4px

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent px-4 py-4 pointer-events-none z-50">
      <div className="flex items-center justify-center gap-3 max-w-md mx-auto pointer-events-auto">
        {/* Main Navigation Group */}
        <div className="relative flex items-center gap-1 bg-[#2A2F3D]/80 backdrop-blur-2xl rounded-full p-1.5 shadow-2xl border border-white/10">
          {/* Animated Background Pill - Perfectly aligned */}
          <div 
            className="absolute top-1.5 left-1.5 h-12 w-[52px] bg-[#3E4454] rounded-full shadow-lg"
            style={{
              transform: `translateX(${activeIndex * (buttonWidth + buttonGap)}px)`,
              transition: mounted ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              willChange: 'transform',
            }}
          />
          
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.path);
                }}
                className="relative z-10 w-[52px] h-12 flex items-center justify-center rounded-full transition-transform duration-150 active:scale-90"
                aria-label={item.label}
              >
                <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
              </button>
            );
          })}
        </div>

        {/* Search */}
        <button
          onClick={() => router.push("/search")}
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 shadow-2xl border border-white/10 active:scale-90 ${
            isActive("/search")
              ? "bg-[#3E4454]"
              : "bg-[#2A2F3D]/80 backdrop-blur-2xl hover:bg-[#3E4454]"
          }`}
          aria-label="Search"
        >
          <Search className="w-6 h-6 text-white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
