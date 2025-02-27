import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker images
  output: 'standalone',

  // Recommended settings for Next.js 15
  reactStrictMode: true,

  // Optional: Configure image domains if using Next.js Image component
  // images: {
  //   domains: ['example.com'],
  // },
};

export default nextConfig;
