import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Use images.domains in development
  images: {
    domains: [
      'picsum.photos',
      'ecom.myitworld.com',
      'm.media-amazon.com',
      'images.unsplash.com',
    ],
  },
};

//Switch to remotePatterns for production
export default nextConfig;
