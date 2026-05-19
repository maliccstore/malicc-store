import React from 'react';
import { Flex, Card, IconButton, Text, Box } from '@radix-ui/themes';
import { ArrowUpIcon, ArrowDownIcon, TrashIcon, CheckIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { Banner } from '@/types/homepage';

interface BannerReorderListProps {
  banners: Banner[];
  onReorder: (bannerIds: string[]) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  isSaving?: boolean;
}

export default function BannerReorderList({
  banners,
  onReorder,
  onEdit,
  onDelete,
  onToggleActive,
  isSaving,
}: BannerReorderListProps) {
  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const list = [...banners];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onReorder(list.map((b) => b.id));
  };

  return (
    <Flex direction="column" gap="3">
      {banners.length === 0 ? (
        <Text size="2" color="gray" className="italic text-center py-6 bg-gray-50 rounded-lg">
          No hero banners created yet. Click &quot;Add Banner&quot; to get started.
        </Text>
      ) : (
        banners.map((banner, index) => (
          <Card key={banner.id} size="1" className="border-gray-200 shadow-xs">
            <Flex align="center" justify="between" gap="3">
              {/* Image & details */}
              <Flex align="center" gap="3" className="flex-1 min-w-0">
                <Box className="w-16 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={banner.image} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
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
                    <Text size="1" className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${banner.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
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

              {/* Actions */}
              <Flex direction="column" align="center" gap="2">
                {/* Reordering */}
                <Box className="flex gap-2">
                  <IconButton
                    size="3"
                    variant="ghost"
                    color="gray"
                    disabled={index === 0 || isSaving}
                    onClick={() => handleMove(index, 'UP')}
                    className="cursor-pointer"
                  >
                    <ArrowUpIcon />
                  </IconButton>
                  <IconButton
                    size="3"
                    variant="ghost"
                    color="gray"
                    disabled={index === banners.length - 1 || isSaving}
                    onClick={() => handleMove(index, 'DOWN')}
                    className="cursor-pointer"
                  >
                    <ArrowDownIcon />
                  </IconButton>
                </Box>

                {/* Edit & active toggle & delete */}
                <Box>
                  <IconButton
                    size="1"
                    variant="soft"
                    color={banner.active ? 'indigo' : 'gray'}
                    disabled={isSaving}
                    onClick={() => onToggleActive(banner.id, !banner.active)}
                    className="cursor-pointer"
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    size="1"
                    variant="soft"
                    color="gray"
                    disabled={isSaving}
                    onClick={() => onEdit(banner)}
                    className="cursor-pointer"
                  >
                    <Pencil1Icon />
                  </IconButton>
                  <IconButton
                    size="1"
                    variant="soft"
                    color="red"
                    disabled={isSaving}
                    onClick={() => onDelete(banner.id)}
                    className="cursor-pointer"
                  >
                    <TrashIcon />
                  </IconButton>
                </Box>
              </Flex>
            </Flex>
          </Card>
        ))
      )}
    </Flex>
  );
}
