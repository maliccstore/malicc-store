import React from 'react';
import { Card, Flex, Box, Heading, Text, Button } from '@radix-ui/themes';
import { Banner } from '@/types/homepage';

interface BannerPreviewProps {
  banner: Partial<Banner>;
}

export default function BannerPreview({ banner }: BannerPreviewProps) {
  const { image, title, subtitle, ctaText } = banner;

  return (
    <Card size="1" className="overflow-hidden border-gray-200 shadow-sm">
      <Box className="relative w-full h-[240px] sm:h-[300px] bg-gray-100 rounded-md overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title || 'Preview Banner'}
            className="w-full h-full object-cover"
          />
        ) : (
          <Flex align="center" justify="center" className="w-full h-full text-gray-400 text-sm italic bg-gray-50">
            No image uploaded yet
          </Flex>
        )}

        {/* Text Overlay */}
        <Box className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
          <Flex direction="column" gap="1" className="max-w-md">
            {title && (
              <Heading size="5" className="font-bold tracking-tight text-white line-clamp-2">
                {title}
              </Heading>
            )}
            {subtitle && (
              <Text size="2" className="text-gray-200 line-clamp-2">
                {subtitle}
              </Text>
            )}
            {ctaText && (
              <Button
                size="1"
                color="indigo"
                variant="solid"
                className="mt-2 w-fit cursor-pointer font-medium"
              >
                {ctaText}
              </Button>
            )}
          </Flex>
        </Box>
      </Box>
    </Card>
  );
}
