import React, { useState } from 'react';
import { Flex, Heading, Text, Card, Box, TextField, Button } from '@radix-ui/themes';
import toast from 'react-hot-toast';
import { HomepageConfig } from '@/types/homepage';
import { AdminProduct } from '@/features/admin/products/product.types';

interface FeaturedProductsCustomizerProps {
  config: HomepageConfig;
  onChange: (config: HomepageConfig) => void;
  products: AdminProduct[];
}

export default function FeaturedProductsCustomizer({ config, onChange, products }: FeaturedProductsCustomizerProps) {
  const [featuredSearch, setFeaturedSearch] = useState('');
  const [showFeaturedDropdown, setShowFeaturedDropdown] = useState(false);

  return (
    <Flex direction="column" gap="4">
      <Box>
        <Heading size="3" className="font-medium mb-2">Featured Products List</Heading>
        <Text size="2" color="gray" mb="3">
          Add products to display in the homepage featured products section.
        </Text>
      </Box>

      {/* Searchable input */}
      <Box className="relative">
        <TextField.Root
          placeholder="Search products to add..."
          value={featuredSearch}
          onChange={(e) => {
            setFeaturedSearch(e.target.value);
            setShowFeaturedDropdown(true);
          }}
          onFocus={() => setShowFeaturedDropdown(true)}
        />
        {showFeaturedDropdown && featuredSearch && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowFeaturedDropdown(false)}
            />
            <Card className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto z-50 shadow-lg">
              <Flex direction="column" gap="1">
                {products
                  .filter((p) =>
                    p.name.toLowerCase().includes(featuredSearch.toLowerCase()) &&
                    !config.featuredProducts.productIds.includes(p.id)
                  )
                  .map((p) => (
                    <Button
                      key={p.id}
                      variant="ghost"
                      color="gray"
                      className="justify-start text-left py-2 h-auto"
                      onClick={() => {
                        const updated = { ...config };
                        updated.featuredProducts.productIds = [
                          ...updated.featuredProducts.productIds,
                          p.id,
                        ];
                        onChange(updated);
                        setFeaturedSearch('');
                        setShowFeaturedDropdown(false);
                        toast.success(`${p.name} added!`);
                      }}
                    >
                      <Flex direction="column" align="start">
                        <Text size="2" weight="bold">{p.name}</Text>
                        <Text size="1" color="gray">SKU: {p.sku || 'N/A'}</Text>
                      </Flex>
                    </Button>
                  ))}
                {products.filter((p) =>
                  p.name.toLowerCase().includes(featuredSearch.toLowerCase()) &&
                  !config.featuredProducts.productIds.includes(p.id)
                ).length === 0 && (
                  <Text size="1" color="gray" className="p-2 text-center">No products found</Text>
                )}
              </Flex>
            </Card>
          </>
        )}
      </Box>

      {/* Selected Products Cards */}
      <Flex direction="column" gap="2">
        {config.featuredProducts.productIds.length === 0 ? (
          <Text size="2" color="gray" className="italic text-center py-4 bg-gray-50 rounded-lg">
            No products selected yet.
          </Text>
        ) : (
          config.featuredProducts.productIds.map((id: string, index: number) => {
            const productObj = products.find((p) => p.id === id);
            if (!productObj) return null;
            return (
              <Card key={id} size="1" className="border-gray-200">
                <Flex align="center" justify="between">
                  <Flex align="center" gap="3">
                    <Text size="2" weight="bold" color="indigo">#{index + 1}</Text>
                    <Box>
                      <Text size="2" weight="bold">{productObj.name}</Text>
                      <Text size="1" color="gray">Price: ₹{productObj.price}</Text>
                    </Box>
                  </Flex>
                  <Button
                    size="1"
                    color="red"
                    variant="soft"
                    className="cursor-pointer"
                    onClick={() => {
                      const updated = { ...config };
                      updated.featuredProducts.productIds =
                        updated.featuredProducts.productIds.filter((pId: string) => pId !== id);
                      onChange(updated);
                    }}
                  >
                    Remove
                  </Button>
                </Flex>
              </Card>
            );
          })
        )}
      </Flex>
    </Flex>
  );
}
