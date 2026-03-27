import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Phase 1: Base configuration */
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
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
