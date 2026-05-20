import React from 'react';
import { Flex, Card, Text, Box, RadioGroup } from '@radix-ui/themes';

interface TopSellingModeSelectorProps {
  mode: 'AUTO' | 'MANUAL';
  onChange: (mode: 'AUTO' | 'MANUAL') => void;
}

export default function TopSellingModeSelector({ mode, onChange }: TopSellingModeSelectorProps) {
  return (
    <Box className="w-full">
      <Text as="label" size="2" weight="bold" mb="2" className="block">Selection Mode</Text>
      <RadioGroup.Root
        value={mode}
        onValueChange={(val) => onChange(val as 'AUTO' | 'MANUAL')}
        className="w-full"
      >
        <Flex direction={{ initial: 'column', sm: 'row' }} gap="3" className="w-full">
          <Card
            size="1"
            className={`flex-1 cursor-pointer border transition-colors ${mode === 'AUTO' ? 'border-indigo-500 bg-indigo-50/20' : 'hover:bg-gray-50'}`}
            onClick={() => onChange('AUTO')}
          >
            <Flex gap="3" align="start" p="2">
              <RadioGroup.Item value="AUTO" id="mode-auto" />
              <Box>
                <Text as="label" htmlFor="mode-auto" size="2" weight="bold" className="cursor-pointer block">
                  Automatic (AUTO)
                </Text>
                <Text size="1" color="gray" className="block mt-1">
                  Products are automatically selected based on sales and order history.
                </Text>
              </Box>
            </Flex>
          </Card>

          <Card
            size="1"
            className={`flex-1 cursor-pointer border transition-colors ${mode === 'MANUAL' ? 'border-indigo-500 bg-indigo-50/20' : 'hover:bg-gray-50'}`}
            onClick={() => onChange('MANUAL')}
          >
            <Flex gap="3" align="start" p="2">
              <RadioGroup.Item value="MANUAL" id="mode-manual" />
              <Box>
                <Text as="label" htmlFor="mode-manual" size="2" weight="bold" className="cursor-pointer block">
                  Manual List (MANUAL)
                </Text>
                <Text size="1" color="gray" className="block mt-1">
                  Manually select, order, and control which top-selling products are shown.
                </Text>
              </Box>
            </Flex>
          </Card>
        </Flex>
      </RadioGroup.Root>
    </Box>
  );
}
