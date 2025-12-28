import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for faster builds
  eslint: {
    // Don't run ESLint during builds (run separately)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't check types during builds (faster, check separately)
    ignoreBuildErrors: false,
  },
  // Enable experimental features for faster builds
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['react-markdown'],
  },
  // Configure images for external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    unoptimized: true, // For static export compatibility
  },
};

export default nextConfig;
