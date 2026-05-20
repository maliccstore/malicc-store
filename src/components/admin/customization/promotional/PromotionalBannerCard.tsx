import React from 'react';
import { Card, Flex, IconButton, Text, Box } from '@radix-ui/themes';
import { ArrowUpIcon, ArrowDownIcon, TrashIcon, CheckIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { Banner } from '@/types/homepage';

interface PromotionalBannerCardProps {
  banner: Banner;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  isSaving?: boolean;
}

export default function PromotionalBannerCard({
  banner,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onToggleActive,
  isSaving,
}: PromotionalBannerCardProps) {
  return (
    <Card size="1" className="border-gray-200 shadow-xs">
      <Flex align="center" justify="between" gap="3">
        {/* Thumbnail & Description */}
        <Flex align="center" gap="3" className="flex-1 min-w-0">
          <Box className="w-20 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={banner.image} alt={banner.title || 'Promotional Banner'} className="w-full h-full object-cover" />
          </Box>
          <Box className="min-w-0 flex-1">
            <Text size="2" weight="bold" className="block truncate">
              {banner.title || 'Untitled Banner'}
            </Text>
            {banner.subtitle && (
              <Text size="1" color="gray" className="block truncate">
                {banner.subtitle}
              </Text>
            )}
            <Flex gap="2" mt="1" align="center">
              <Text
                size="1"
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${banner.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              >
                {banner.active ? 'ACTIVE' : 'INACTIVE'}
              </Text>
              {banner.redirectUrl && (
                <Text size="1" color="indigo" className="truncate text-[10px]">
                  URL: {banner.redirectUrl}
                </Text>
              )}
            </Flex>
          </Box>
        </Flex>

        {/* Actions panel */}
        <Flex align="center" gap="2">
          {/* Reordering */}
          <IconButton
            size="1"
            variant="ghost"
            color="gray"
            disabled={index === 0 || isSaving}
            onClick={onMoveUp}
            className="cursor-pointer"
          >
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            size="1"
            variant="ghost"
            color="gray"
            disabled={index === total - 1 || isSaving}
            onClick={onMoveDown}
            className="cursor-pointer"
          >
            <ArrowDownIcon />
          </IconButton>

          {/* Visibility toggle, edit and delete */}
          <IconButton
            size="1"
            variant="soft"
            color={banner.active ? 'indigo' : 'gray'}
            disabled={isSaving}
            onClick={onToggleActive}
            className="cursor-pointer"
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            size="1"
            variant="soft"
            color="gray"
            disabled={isSaving}
            onClick={onEdit}
            className="cursor-pointer"
          >
            <Pencil1Icon />
          </IconButton>
          <IconButton
            size="1"
            variant="soft"
            color="red"
            disabled={isSaving}
            onClick={onDelete}
            className="cursor-pointer"
          >
            <TrashIcon />
          </IconButton>
        </Flex>
      </Flex>
    </Card>
  );
}
