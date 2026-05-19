import React from 'react';
import { Flex, Heading, Text, Box } from '@radix-ui/themes';
import { HomepageConfig } from '@/types/homepage';
import { AdminProduct } from '@/features/admin/products/product.types';
import FeaturedProductPicker from './FeaturedProductPicker';
import FeaturedProductTable from './FeaturedProductTable';

interface FeaturedProductsManagerProps {
  config: HomepageConfig;
  onChange: (config: HomepageConfig) => void;
  products: AdminProduct[];
}

export default function FeaturedProductsManager({
  config,
  onChange,
  products,
}: FeaturedProductsManagerProps) {
  const selectedIds = config.featuredProducts.productIds;

  const handleSelect = (ids: string[]) => {
    const updated = { ...config };
    updated.featuredProducts.productIds = ids;
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    const updated = { ...config };
    updated.featuredProducts.productIds = selectedIds.filter((pId) => pId !== id);
    onChange(updated);
  };

  const handleReorder = (ids: string[]) => {
    const updated = { ...config };
    updated.featuredProducts.productIds = ids;
    onChange(updated);
  };

  return (
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Box>
          <Heading size="3" className="font-medium">Featured Products</Heading>
          <Text size="1" color="gray">
            Selected products will display in the featured products layout block ({selectedIds.length} selected).
          </Text>
        </Box>
        <FeaturedProductPicker
          products={products}
          selectedIds={selectedIds}
          onSelect={handleSelect}
        />
      </Flex>

      <FeaturedProductTable
        selectedIds={selectedIds}
        products={products}
        onReorder={handleReorder}
        onRemove={handleRemove}
      />
    </Flex>
  );
}
