import React, { useState, useEffect } from 'react';
import { Flex, Heading, Text, Box, Card, Grid, Separator } from '@radix-ui/themes';
import { HomepageConfig } from '@/types/homepage';
import { AdminProduct } from '@/features/admin/products/product.types';
import NewArrivalsSettings from './NewArrivalsSettings';

interface NewArrivalsManagerProps {
  config: HomepageConfig;
  onChange: (config: HomepageConfig) => void;
  products: AdminProduct[];
}

export default function NewArrivalsManager({ config, onChange, products }: NewArrivalsManagerProps) {
  const [error, setError] = useState<string | undefined>(undefined);

  const { enabled, limit } = config.newArrivals;

  useEffect(() => {
    if (enabled && (limit < 1 || limit > 24)) {
      setError('Display limit must be between 1 and 24 products.');
    } else {
      setError(undefined);
    }
  }, [enabled, limit]);

  // Sort products by date descending (newest first)
  const sortedProducts = [...products].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const displayedProducts = sortedProducts.slice(0, limit);

  return (
    <Flex direction="column" gap="4">
      <Box>
        <Heading size="3" className="font-medium">New Arrivals Settings</Heading>
        <Text size="1" color="gray">
          Configure how many newly added products are showcased on the homepage.
        </Text>
      </Box>

      {/* Settings configuration block */}
      <NewArrivalsSettings config={config} onChange={onChange} error={error} />

      <Separator size="4" className="my-2" />

      {/* Visual responsive storefront preview mockup */}
      <Flex direction="column" gap="2">
        <Heading size="2" className="text-gray-500 font-semibold uppercase tracking-wider">
          Storefront Display Preview
        </Heading>
        {!enabled ? (
          <Box className="py-6 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center">
            <Text size="2" color="gray" className="italic">
              New Arrivals section is currently disabled.
            </Text>
          </Box>
        ) : (
          <Card size="1" className="border-gray-200 bg-gray-50/50">
            <Flex direction="column" gap="3" p="1">
              <Box className="p-3 bg-white border border-gray-100 rounded-md mb-2">
                <Text size="2" weight="bold" className="block text-indigo-600">
                  New Arrivals Section Enabled
                </Text>
                <Text size="2" color="gray" className="block mt-1">
                  The storefront will fetch and display the <Text weight="bold">{limit}</Text> newest catalog items.
                </Text>
              </Box>

              {displayedProducts.length === 0 ? (
                <Box className="py-6 bg-white border border-gray-100 rounded-md text-center">
                  <Text size="2" color="gray" className="italic">
                    No products found in the catalog.
                  </Text>
                </Box>
              ) : (
                <Grid columns={{ initial: '2', sm: '4' }} gap="2">
                  {displayedProducts.slice(0, 8).map((product) => {
                    const imageUrl = product.images?.[0] || '';
                    return (
                      <Card key={product.id} size="1" className="bg-white border-gray-150">
                        <Flex direction="column" gap="2">
                          <Box className="w-full h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center relative">
                            {imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Text size="1" color="gray">No Image</Text>
                            )}
                          </Box>
                          <Box>
                            <Text size="1" weight="bold" className="block truncate">{product.name}</Text>
                            <Text size="1" color="gray" className="block">₹{product.price}</Text>
                          </Box>
                        </Flex>
                      </Card>
                    );
                  })}
                </Grid>
              )}
              {limit > 8 && displayedProducts.length > 8 && (
                <Text size="1" color="gray" className="block text-right">
                  + {Math.min(displayedProducts.length, limit) - 8} more products (preview capped at 8)
                </Text>
              )}
            </Flex>
          </Card>
        )}
      </Flex>
    </Flex>
  );
}
