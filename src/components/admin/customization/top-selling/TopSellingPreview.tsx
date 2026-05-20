import React from 'react';
import { Card, Flex, Grid, Box, Text, Heading } from '@radix-ui/themes';
import { AdminProduct } from '@/features/admin/products/product.types';

interface TopSellingPreviewProps {
  mode: 'AUTO' | 'MANUAL';
  limit: number;
  selectedIds: string[];
  products: AdminProduct[];
}

export default function TopSellingPreview({ mode, limit, selectedIds, products }: TopSellingPreviewProps) {
  return (
    <Card size="1" className="border-gray-200 bg-gray-50/50">
      <Flex direction="column" gap="3" p="1">
        <Heading size="2" className="text-gray-500 font-semibold uppercase tracking-wider">
          Storefront Display Preview
        </Heading>

        {mode === 'AUTO' ? (
          <Box className="p-3 bg-white border border-gray-100 rounded-md">
            <Text size="2" weight="bold" className="block text-indigo-600">
              Automatic Mode Active
            </Text>
            <Text size="2" color="gray" className="block mt-1">
              Showing the top <Text weight="bold">{limit}</Text> highest-selling products based on order history.
            </Text>
            {selectedIds.length > 0 && (
              <Text size="1" color="gray" className="block mt-2 italic">
                Fallback: If order data is insufficient, it will display {selectedIds.length} manual fallback products.
              </Text>
            )}
          </Box>
        ) : (
          <Box>
            {selectedIds.length === 0 ? (
              <Text size="2" color="gray" className="italic block text-center py-4 bg-white border rounded">
                No products configured to display.
              </Text>
            ) : (
              <Grid gap="3">
                {selectedIds.slice(0, limit).map((id) => {
                  const product = products.find((p) => p.id === id);
                  if (!product) return null;
                  const imageUrl = product.images?.[0] || '';

                  return (
                    <Card key={id} size="1" className="bg-white border-gray-150">
                      <Flex direction="column" gap="2">
                        <Box className="w-full h-50 bg-gray-100 rounded overflow-hidden">
                          {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Flex align="center" justify="center" className="w-full h-full text-gray-400 text-[9px]">
                              No image
                            </Flex>
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
            {selectedIds.length > limit && (
              <Text size="1" color="gray" className="block mt-2 text-right">
                + {selectedIds.length - limit} more products (exceeds limit of {limit})
              </Text>
            )}
          </Box>
        )}
      </Flex>
    </Card>
  );
}
