import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Phase 1: Base configuration */
  reactStrictMode: true,
  serverExternalPackages: ["geoip-lite"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
      {
        pathname: "/assets/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
    qualities: [75, 90, 100],
  },
  webpack: (config, { dev }) => {
    // Avoid intermittent Windows file lock issues in .next cache.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
