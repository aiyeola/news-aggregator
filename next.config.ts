import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker images
  output: 'standalone',

  // Recommended settings for Next.js 15
  reactStrictMode: true,
};

export default nextConfig;
