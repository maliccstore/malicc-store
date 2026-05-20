'use client';

import { Card, Flex, Text, IconButton } from '@radix-ui/themes';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface HomepageSectionOrderProps {
  sections: { id: string; name: string; enabled: boolean }[];
  onOrderChange: (orderedIds: string[]) => void;
}

export default function HomepageSectionOrder({
  sections,
  onOrderChange,
}: HomepageSectionOrderProps) {
  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const newIndex = direction === 'UP' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const reordered = [...sections];
    const [removed] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, removed);

    onOrderChange(reordered.map((s) => s.id));
  };

  return (
    <Flex direction="column" gap="2">
      {sections.map((section, index) => (
        <Card key={section.id} size="1" style={{ opacity: section.enabled ? 1 : 0.6 }}>
          <Flex align="center" justify="between" p="2">
            <Flex align="center" gap="3">
              <Text size="1" color="gray" weight="bold">
                #{index + 1}
              </Text>
              <Text size="2" weight="bold">
                {section.name}
              </Text>
              {!section.enabled && (
                <Text size="1" color="gray" style={{ fontStyle: 'italic' }}>
                  (Disabled)
                </Text>
              )}
            </Flex>
            <Flex gap="2">
              <IconButton
                size="1"
                variant="ghost"
                color="gray"
                onClick={() => handleMove(index, 'UP')}
                disabled={index === 0}
                className="cursor-pointer"
              >
                <ArrowUpIcon />
              </IconButton>
              <IconButton
                size="1"
                variant="ghost"
                color="gray"
                onClick={() => handleMove(index, 'DOWN')}
                disabled={index === sections.length - 1}
                className="cursor-pointer"
              >
                <ArrowDownIcon />
              </IconButton>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}
