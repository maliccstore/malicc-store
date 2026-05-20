'use client';

import { Flex, Switch, Text } from '@radix-ui/themes';

interface HomepageSectionToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function HomepageSectionToggle({
  label,
  checked,
  onChange,
  disabled = false,
}: HomepageSectionToggleProps) {
  return (
    <Flex align="center" justify="between" className="w-full">
      <Text size="2" weight="medium" color={disabled ? 'gray' : undefined}>
        {label}
      </Text>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="cursor-pointer"
      />
    </Flex>
  );
}
