import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Disable static page generation for all pages
    isrMemoryCacheSize: 0,
  },
  // Disable static optimization for all pages
  output: 'standalone',
};

export default nextConfig;
