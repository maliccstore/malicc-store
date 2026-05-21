import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [process.env.DOMAIN_NAME || 'http://localhost:3000'],
  // Use images.domains in development
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rashksastabazaar.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.rashksastabazaar.com',
        pathname: '/uploads/**',
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

//Switch to remotePatterns for production
export default nextConfig;
