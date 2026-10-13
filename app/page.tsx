"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 1000);
    setTimeout(() => router.push("/welcome"), 2000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1018]">
      <div className={`transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"} text-center`}>
        {/* Original Trust Wallet Logo */}
        <div className="flex items-center justify-center mb-6">
          <Image 
            src="/trust-wallet-logo.png" 
            alt="Trust Wallet Logo" 
            width={120} 
            height={120}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-white text-3xl font-bold tracking-tight">Trust Vault</h1>
        <p className="text-[#8E8E93] text-sm mt-2">Secure Crypto Wallet</p>
      </div>
    </div>
  );
}
