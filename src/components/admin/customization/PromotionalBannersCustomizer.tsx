import React from 'react';
import { Flex, Heading, Text, Grid, Card, IconButton, Box } from '@radix-ui/themes';
import { CheckIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import { HomepageConfig, Banner } from '@/types/homepage';

interface PromotionalBannersCustomizerProps {
  config: HomepageConfig;
  onChange: (config: HomepageConfig) => void;
}

export default function PromotionalBannersCustomizer({ config, onChange }: PromotionalBannersCustomizerProps) {
  const handleToggleBannerActive = (id: string) => {
    const updated = { ...config };
    updated.promotionalBanners = updated.promotionalBanners.map((b: Banner) =>
      b.id === id ? { ...b, active: !b.active } : b
    );
    onChange(updated);
  };

  const handleRemoveBanner = (id: string) => {
    const updated = { ...config };
    updated.promotionalBanners = updated.promotionalBanners.filter((b: Banner) => b.id !== id);
    onChange(updated);
  };

  const handleMoveBanner = (index: number, direction: 'UP' | 'DOWN') => {
    const updated = { ...config };
    const banners = [...updated.promotionalBanners];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const temp = banners[index];
    banners[index] = banners[targetIndex];
    banners[targetIndex] = temp;

    const reordered = banners.map((b: Banner, idx: number) => ({ ...b, order: idx }));
    updated.promotionalBanners = reordered;
    onChange(updated);
  };

  return (
    <Flex direction="column" gap="4">
      <Heading size="3" className="font-medium mb-2">Banners List</Heading>
      {config.promotionalBanners.length === 0 ? (
        <Text size="2" color="gray" className="italic text-center py-4 bg-gray-50 rounded-lg">
          No promotional banners added yet.
        </Text>
      ) : (
        <Grid columns={{ initial: '1', sm: '2' }} gap="4">
          {config.promotionalBanners.map((banner: Banner, index: number) => (
            <Card key={banner.id} size="1" className="relative border-gray-200">
              <Flex direction="column" gap="2">
                <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.image}
                    alt={banner.title || 'Promo Banner'}
                    className="w-full h-full object-cover"
                  />
                  <Box className="absolute top-2 right-2 flex gap-1">
                    <IconButton
                      size="1"
                      color={banner.active ? 'indigo' : 'gray'}
                      variant="solid"
                      onClick={() => handleToggleBannerActive(banner.id)}
                      className="cursor-pointer"
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      size="1"
                      color="red"
                      variant="solid"
                      onClick={() => handleRemoveBanner(banner.id)}
                      className="cursor-pointer"
                    >
                      <TrashIcon />
                    </IconButton>
                  </Box>
                </div>
                <Flex direction="column" gap="1" p="2">
                  <Text size="2" weight="bold" truncate>{banner.title || 'Untitled Banner'}</Text>
                  <Text size="1" color="gray" truncate>{banner.subtitle || 'No subtitle'}</Text>
                  <Text size="1" color="indigo" truncate>Redirect: {banner.redirectUrl || 'None'}</Text>
                  <Flex gap="2" mt="2" justify="end">
                    <IconButton
                      size="1"
                      variant="soft"
                      disabled={index === 0}
                      onClick={() => handleMoveBanner(index, 'UP')}
                      className="cursor-pointer"
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="1"
                      variant="soft"
                      disabled={index === config.promotionalBanners.length - 1}
                      onClick={() => handleMoveBanner(index, 'DOWN')}
                      className="cursor-pointer"
                    >
                      <ArrowDownIcon />
                    </IconButton>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Grid>
      )}
    </Flex>
  );
}
