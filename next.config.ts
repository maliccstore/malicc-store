import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [process.env.DOMAIN_NAME || 'http://localhost:3000'],
  // Use images.domains in development
  images: {
    domains: [
      'picsum.photos',
      'ecom.myitworld.com',
      'm.media-amazon.com',
      'images.unsplash.com',
      'localhost',
    ],
  },
};

//Switch to remotePatterns for production
export default nextConfig;
