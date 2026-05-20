import React from 'react';
import { Table, Flex, Box, IconButton, Text } from '@radix-ui/themes';
import { ArrowUpIcon, ArrowDownIcon, TrashIcon } from '@radix-ui/react-icons';
import { AdminProduct } from '@/features/admin/products/product.types';

interface FeaturedProductTableProps {
  selectedIds: string[];
  products: AdminProduct[];
  onReorder: (ids: string[]) => void;
  onRemove: (id: string) => void;
}

export default function FeaturedProductTable({
  selectedIds,
  products,
  onReorder,
  onRemove,
}: FeaturedProductTableProps) {
  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const list = [...selectedIds];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onReorder(list);
  };

  if (selectedIds.length === 0) {
    return (
      <Box className="py-8 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center">
        <Text size="2" color="gray" className="italic">
          No featured products selected. Click &quot;Select Products&quot; to pick some.
        </Text>
      </Box>
    );
  }

  return (
    <Box className="border border-gray-200 rounded-lg overflow-hidden">
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell style={{ width: '80px' }}>Pos</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ width: '80px' }}>Image</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ width: '120px' }}>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ width: '160px' }} justify="end">Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {selectedIds.map((id, index) => {
            const product = products.find((p) => p.id === id);
            if (!product) return null;

            const imageUrl = product.images?.[0] || '';

            return (
              <Table.Row key={id} align="center">
                <Table.RowHeaderCell>
                  <Text size="2" weight="bold" color="indigo">#{index + 1}</Text>
                </Table.RowHeaderCell>
                <Table.Cell>
                  <Box className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Flex align="center" justify="center" className="w-full h-full text-gray-400 text-[10px]">
                        No img
                      </Flex>
                    )}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" weight="bold" className="block line-clamp-1">{product.name}</Text>
                  <Text size="1" color="gray">SKU: {product.sku || 'N/A'}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">₹{product.price}</Text>
                </Table.Cell>
                <Table.Cell justify="end">
                  <Flex gap="2" justify="end" align="center">
                    <IconButton
                      size="1"
                      variant="ghost"
                      color="gray"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'UP')}
                      className="cursor-pointer"
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="1"
                      variant="ghost"
                      color="gray"
                      disabled={index === selectedIds.length - 1}
                      onClick={() => handleMove(index, 'DOWN')}
                      className="cursor-pointer"
                    >
                      <ArrowDownIcon />
                    </IconButton>
                    <IconButton
                      size="1"
                      variant="soft"
                      color="red"
                      onClick={() => onRemove(id)}
                      className="cursor-pointer"
                    >
                      <TrashIcon />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
