import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [process.env.DOMAIN_NAME || 'http://localhost:3000'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rashksastabazaar.com',
      },
      {
        protocol: 'https',
        hostname: 'www.rashksastabazaar.com',
      },

      // Existing sources
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'ecom.myitworld.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
