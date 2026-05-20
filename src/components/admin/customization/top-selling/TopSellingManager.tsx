import React from 'react';
import { Flex, Heading, Text, Grid, Box, TextField, Separator } from '@radix-ui/themes';
import { HomepageConfig } from '@/types/homepage';
import { AdminProduct } from '@/features/admin/products/product.types';
import TopSellingModeSelector from './TopSellingModeSelector';
import ManualProductSelector from './ManualProductSelector';
import TopSellingPreview from './TopSellingPreview';

interface TopSellingManagerProps {
  config: HomepageConfig;
  onChange: (config: HomepageConfig) => void;
  products: AdminProduct[];
}

export default function TopSellingManager({ config, onChange, products }: TopSellingManagerProps) {
  const { mode, limit, productIds, minimumThreshold } = config.topSelling;

  const handleModeChange = (newMode: 'AUTO' | 'MANUAL') => {
    const updated = { ...config };
    updated.topSelling.mode = newMode;
    onChange(updated);
  };

  const handleLimitChange = (val: string) => {
    const num = parseInt(val) || 0;
    const updated = { ...config };
    updated.topSelling.limit = num;
    onChange(updated);
  };

  const handleThresholdChange = (val: string) => {
    const num = parseInt(val) || 0;
    const updated = { ...config };
    updated.topSelling.minimumThreshold = num;
    onChange(updated);
  };

  const handleProductIdsChange = (ids: string[]) => {
    const updated = { ...config };
    updated.topSelling.productIds = ids;
    onChange(updated);
  };

  return (
    <Flex direction="column" gap="4">
      <Box>
        <Heading size="3" className="font-medium">Top Selling Products Settings</Heading>
        <Text size="1" color="gray">
          Configure how highest-selling products are fetched and sorted on the homepage storefront.
        </Text>
      </Box>

      {/* Mode Selector */}
      <TopSellingModeSelector mode={mode} onChange={handleModeChange} />

      {/* Common configuration parameters */}
      <Grid columns={{ initial: '1', sm: '2' }} gap="3">
        <Box>
          <Text as="label" size="2" weight="bold" mb="1" className="block">Max Product Display Limit</Text>
          <Text size="1" color="gray" mb="2" className="block">
            Number of products shown in this section.
          </Text>
          <TextField.Root
            type="number"
            value={limit}
            onChange={(e) => handleLimitChange(e.target.value)}
            min="1"
            max="20"
          />
        </Box>

        <Box>
          <Text as="label" size="2" weight="bold" mb="1" className="block">Minimum Threshold</Text>
          <Text size="1" color="gray" mb="2" className="block">
            Fall back to manual list if AUTO finds fewer products than this.
          </Text>
          <TextField.Root
            type="number"
            value={minimumThreshold}
            onChange={(e) => handleThresholdChange(e.target.value)}
            min="0"
          />
        </Box>
      </Grid>

      <Separator size="4" className="my-2" />

      {/* Manual list configuration */}
      <ManualProductSelector
        products={products}
        selectedIds={productIds}
        onChange={handleProductIdsChange}
      />

      <Separator size="4" className="my-2" />

      {/* Preview Section */}
      <TopSellingPreview
        mode={mode}
        limit={limit}
        selectedIds={productIds}
        products={products}
      />
    </Flex>
  );
}
