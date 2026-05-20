import React from 'react';
import { Flex, Box, Text, TextField, Switch, Card } from '@radix-ui/themes';
import { HomepageConfig } from '@/types/homepage';

interface NewArrivalsSettingsProps {
  config: HomepageConfig;
  onChange: (config: HomepageConfig) => void;
  error?: string;
}

export default function NewArrivalsSettings({ config, onChange, error }: NewArrivalsSettingsProps) {
  const { enabled, limit } = config.newArrivals;

  const handleEnabledChange = (checked: boolean) => {
    const updated = { ...config };
    updated.newArrivals.enabled = checked;
    onChange(updated);
  };

  const handleLimitChange = (val: string) => {
    const num = parseInt(val) || 0;
    const updated = { ...config };
    updated.newArrivals.limit = num;
    onChange(updated);
  };

  return (
    <Flex direction="column" gap="4">
      {/* Enable/Disable Section Toggle */}
      <Card size="1" className="border-gray-200">
        <Flex justify="between" align="center" p="1">
          <Box>
            <Text size="2" weight="bold" className="block">Enable Section</Text>
            <Text size="1" color="gray" className="block mt-0.5">
              Display the New Arrivals section on the homepage.
            </Text>
          </Box>
          <Switch
            checked={enabled}
            onCheckedChange={handleEnabledChange}
            className="cursor-pointer"
          />
        </Flex>
      </Card>

      {/* Product Limit Config */}
      <Box>
        <Text as="label" size="2" weight="bold" mb="1" className="block">Product Display Limit</Text>
        <Text size="1" color="gray" mb="2" className="block">
          Number of recently added products to fetch and render.
        </Text>
        <TextField.Root
          type="number"
          value={limit}
          onChange={(e) => handleLimitChange(e.target.value)}
          min="1"
          max="24"
          disabled={!enabled}
        />
        {error && (
          <Text size="1" color="red" className="block mt-1 font-medium">
            {error}
          </Text>
        )}
      </Box>
    </Flex>
  );
}
