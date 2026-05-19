import React from 'react';
import { Flex, Box, Text, TextField } from '@radix-ui/themes';
import { HomepageConfig } from '@/types/homepage';

interface NewArrivalsCustomizerProps {
  config: HomepageConfig;
  onChange: (config: HomepageConfig) => void;
}

export default function NewArrivalsCustomizer({ config, onChange }: NewArrivalsCustomizerProps) {
  return (
    <Flex direction="column" gap="4">
      <Box>
        <Text as="label" size="2" weight="bold" mb="1" className="block">Limit</Text>
        <Text size="1" color="gray" mb="2" className="block">
          Number of recent products to display in the New Arrivals list.
        </Text>
        <TextField.Root
          type="number"
          value={config.newArrivals.limit}
          onChange={(e) => {
            const updated = { ...config };
            updated.newArrivals.limit = parseInt(e.target.value) || 0;
            onChange(updated);
          }}
        />
      </Box>
    </Flex>
  );
}
