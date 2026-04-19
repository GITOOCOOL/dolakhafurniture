import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.facebook.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // This is the clean way to hide the "N" in Next.js 15
  devIndicators: false, 
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;
