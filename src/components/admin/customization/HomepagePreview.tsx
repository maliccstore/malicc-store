'use client';

import React from 'react';
import { Box, Flex, Text, Heading, Card } from '@radix-ui/themes';
import { HomepageConfig } from '@/types/homepage';
import { AdminProduct } from '@/features/admin/products/product.types';
import { Product } from '@/types/product';
import HeroCarousel from '@/components/home/HeroCarousel';
import HomeProductList from '@/components/home/HomeProductList';
import PromotionalBanner from '@/components/home/PromotionalBanner';

interface HomepagePreviewProps {
  config: HomepageConfig;
  products: AdminProduct[];
}

export default function HomepagePreview({ config, products }: HomepagePreviewProps) {
  // Convert AdminProduct to Storefront Product format
  const mapProduct = (p: AdminProduct): Product => {
    return {
      id: p.id,
      name: p.name,
      description: p.description || '',
      image: p.images?.[0] || '',
      images: p.images || [],
      price: p.price,
      rating: '4',
      category: typeof p.category === 'object' ? p.category.name : (p.category || 'General'),
      inStock: (p.inventory?.availableQuantity ?? 0) > 0,
      availableQuantity: p.inventory?.availableQuantity ?? 0,
      isActive: p.status === 'ACTIVE',
      createdAt: p.createdAt,
    };
  };

  // Derive products for Featured section
  const featuredProducts = (config.featuredProducts?.productIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is AdminProduct => !!p)
    .map(mapProduct);

  // Derive products for Top Selling section
  let topSellingProducts: Product[] = [];
  if (config.topSelling?.enabled) {
    if (config.topSelling.mode === 'MANUAL') {
      topSellingProducts = (config.topSelling.productIds || [])
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is AdminProduct => !!p)
        .map(mapProduct);
    } else {
      // AUTO mode: take active products up to the limit
      topSellingProducts = products
        .filter((p) => p.status === 'ACTIVE')
        .slice(0, config.topSelling.limit)
        .map(mapProduct);
    }
  }

  // Derive products for New Arrivals section
  const newArrivalsProducts = [...products]
    .filter((p) => p.status === 'ACTIVE')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, config.newArrivals?.limit || 4)
    .map(mapProduct);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        const activeBanners = (config.heroBanners || []).filter((b) => b.active);
        if (activeBanners.length === 0) {
          return (
            <Box key="hero" className="py-12 bg-gray-900 text-center flex items-center justify-center min-h-[300px]">
              <Text size="3" className="text-gray-400 italic">No active hero banners to display</Text>
            </Box>
          );
        }
        return (
          <Box key="hero" className="w-full">
            <HeroCarousel banners={config.heroBanners} />
          </Box>
        );

      case 'featured':
        if (!config.featuredProducts?.enabled) return null;
        return (
          <HomeProductList
            key="featured"
            title="Featured Products"
            products={featuredProducts}
          />
        );

      case 'topSelling':
        if (!config.topSelling?.enabled) return null;
        return (
          <HomeProductList
            key="topSelling"
            title="Top Selling Products"
            products={topSellingProducts}
          />
        );

      case 'promotional':
        const activePromos = (config.promotionalBanners || []).filter((b) => b.active);
        if (activePromos.length === 0) return null;
        return (
          <PromotionalBanner
            key="promotional"
            blocks={config.promotionalBanners}
          />
        );

      case 'newArrivals':
        if (!config.newArrivals?.enabled) return null;
        return (
          <HomeProductList
            key="newArrivals"
            title="New Arrivals"
            products={newArrivalsProducts}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Flex direction={"column"} gap="4" justify="center" align="center" className="bg-gray-100 p-3 rounded-lg border border-gray-200">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
      <Box>
        <Heading size="3" className="font-semibold text-gray-800">Storefront Preview</Heading>
        <Text size="1" color="gray">Inspect the homepage layout sequence and active sections.</Text>
      </Box>
      <Card className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden bg-white p-0">
        {/* Viewport content */}
        <Box className="max-h-[450px] overflow-y-auto w-full bg-white hide-scrollbar">
          {config.sectionOrder.map((sectionId) => renderSection(sectionId))}
        </Box>
      </Card>
    </Flex>
  );
}
