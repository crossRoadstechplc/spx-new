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
};

export default nextConfig;
