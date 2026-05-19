import React, { useState } from 'react';
import { Flex, Heading, Text, Card, Box, TextField, Button, Grid, Select, Separator } from '@radix-ui/themes';
import toast from 'react-hot-toast';
import { HomepageConfig } from '@/types/homepage';
import { AdminProduct } from '@/features/admin/products/product.types';

interface TopSellingCustomizerProps {
  config: HomepageConfig;
  onChange: (config: HomepageConfig) => void;
  products: AdminProduct[];
}

export default function TopSellingCustomizer({ config, onChange, products }: TopSellingCustomizerProps) {
  const [topSellingSearch, setTopSellingSearch] = useState('');
  const [showTopSellingDropdown, setShowTopSellingDropdown] = useState(false);

  return (
    <Flex direction="column" gap="4">
      <Grid gap="4">
        <Box>
          <Text as="label" size="2" weight="bold" mb="1" className="block">Mode</Text>
          <Select.Root
            value={config.topSelling.mode}
            onValueChange={(val: 'AUTO' | 'MANUAL') => {
              const updated = { ...config };
              updated.topSelling.mode = val;
              onChange(updated);
            }}
          >
            <Select.Trigger className="w-full" />
            <Select.Content>
              <Select.Item value="AUTO">AUTO (Based on order counts)</Select.Item>
              <Select.Item value="MANUAL">MANUAL (Manually selected products)</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>

        <Box>
          <Text as="label" size="2" weight="bold" mb="1" className="block">Limit</Text>
          <TextField.Root
            type="number"
            value={config.topSelling.limit}
            onChange={(e) => {
              const updated = { ...config };
              updated.topSelling.limit = parseInt(e.target.value) || 0;
              onChange(updated);
            }}
          />
        </Box>
      </Grid>

      <Box>
        <Text as="label" size="2" weight="bold" mb="1" className="block">
          Minimum Threshold (Auto Mode Fallback)
        </Text>
        <Text size="1" color="gray" mb="2" className="block">
          If automatic system finds fewer than this number of products, it falls back to the manual list.
        </Text>
        <TextField.Root
          type="number"
          value={config.topSelling.minimumThreshold}
          onChange={(e) => {
            const updated = { ...config };
            updated.topSelling.minimumThreshold = parseInt(e.target.value) || 0;
            onChange(updated);
          }}
        />
      </Box>

      <Separator size="4" className="my-2" />

      {/* Product list */}
      <Box>
        <Heading size="3" className="font-medium mb-2">Manual / Fallback Products</Heading>
        <Text size="2" color="gray" mb="3">
          Specify products for manual list. Used when Mode is MANUAL or as fallback in AUTO mode.
        </Text>

        <Box className="relative mb-3">
          <TextField.Root
            placeholder="Search products to add..."
            value={topSellingSearch}
            onChange={(e) => {
              setTopSellingSearch(e.target.value);
              setShowTopSellingDropdown(true);
            }}
            onFocus={() => setShowTopSellingDropdown(true)}
          />
          {showTopSellingDropdown && topSellingSearch && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowTopSellingDropdown(false)}
              />
              <Card className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto z-50 shadow-lg">
                <Flex direction="column" gap="1">
                  {products
                    .filter((p) =>
                      p.name.toLowerCase().includes(topSellingSearch.toLowerCase()) &&
                      !config.topSelling.productIds.includes(p.id)
                    )
                    .map((p) => (
                      <Button
                        key={p.id}
                        variant="ghost"
                        color="gray"
                        className="justify-start text-left py-2 h-auto"
                        onClick={() => {
                          const updated = { ...config };
                          updated.topSelling.productIds = [
                            ...updated.topSelling.productIds,
                            p.id,
                          ];
                          onChange(updated);
                          setTopSellingSearch('');
                          setShowTopSellingDropdown(false);
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
                    p.name.toLowerCase().includes(topSellingSearch.toLowerCase()) &&
                    !config.topSelling.productIds.includes(p.id)
                  ).length === 0 && (
                    <Text size="1" color="gray" className="p-2 text-center">No products found</Text>
                  )}
                </Flex>
              </Card>
            </>
          )}
        </Box>

        <Flex direction="column" gap="2">
          {config.topSelling.productIds.length === 0 ? (
            <Text size="2" color="gray" className="italic text-center py-4 bg-gray-50 rounded-lg">
              No products selected yet.
            </Text>
          ) : (
            config.topSelling.productIds.map((id: string, index: number) => {
              const productObj = products.find((p) => p.id === id);
              if (!productObj) return null;
              return (
                <Card key={id} size="1" className="border-gray-200">
                  <Flex align="center" justify="between">
                    <Flex align="center" gap="3">
                      <Text size="2" weight="bold" color="indigo">#{index + 1}</Text>
                      <Box className="grid grid-cols-2">
                        <Box className="font-medium text-sm">{productObj.name}</Box>
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
                        updated.topSelling.productIds =
                          updated.topSelling.productIds.filter((pId: string) => pId !== id);
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
      </Box>
    </Flex>
  );
}
