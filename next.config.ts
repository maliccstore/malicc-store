import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [process.env.DOMAIN_NAME || 'http://localhost:3000'],

  images: {
    domains: [
      'rashksastabazaar.com',
      'www.rashksastabazaar.com',
      'picsum.photos',
      'ecom.myitworld.com',
      'm.media-amazon.com',
      'images.unsplash.com',
      'localhost',
    ],
  },
};

export default nextConfig;
