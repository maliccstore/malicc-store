import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rashksastabazaar.com',
        pathname: '/api/uploads/**', // adjust if your path differs
      },
      {
        protocol: 'https',
        hostname: 'www.rashksastabazaar.com',
        pathname: '/api/uploads/**',
      },
      // keep your other sources
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ecom.myitworld.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    qualities: [25, 50, 75, 100],
  },
};

export default nextConfig;
