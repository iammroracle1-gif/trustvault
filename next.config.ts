import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
        pathname: '/logos/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.coincap.io',
        pathname: '/assets/icons/**',
      },
    ],
  },
  
  // Optimize for PWA performance
  compress: true,
  
  // Enable experimental features for faster loading
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
