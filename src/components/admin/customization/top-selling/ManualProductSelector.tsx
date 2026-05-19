import React, { useState } from 'react';
import { Flex, Text, Button, TextField, Checkbox, Box, Dialog, Card, Table, IconButton } from '@radix-ui/themes';
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon } from '@radix-ui/react-icons';
import { AdminProduct } from '@/features/admin/products/product.types';

interface ManualProductSelectorProps {
  products: AdminProduct[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  maxLimit?: number;
}

export default function ManualProductSelector({
  products,
  selectedIds,
  onChange,
  maxLimit = 12,
}: ManualProductSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  const handleOpen = () => {
    setTempSelected(selectedIds);
    setSearchQuery('');
    setIsOpen(true);
  };

  const handleToggle = (id: string) => {
    if (tempSelected.includes(id)) {
      setTempSelected(tempSelected.filter((item) => item !== id));
    } else {
      if (tempSelected.length >= maxLimit) {
        alert(`You can select a maximum of ${maxLimit} products.`);
        return;
      }
      setTempSelected([...tempSelected, id]);
    }
  };

  const handleSave = () => {
    onChange(tempSelected);
    setIsOpen(false);
  };

  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const list = [...selectedIds];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onChange(list);
  };

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter((pId) => pId !== id));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Flex justify="between" align="center" mb="3">
        <Box>
          <Text size="2" weight="bold">Manual / Fallback Products</Text>
          <Text size="1" color="gray" className="block mt-0.5">
            Specify which products are displayed. Used when mode is MANUAL or as automatic mode fallbacks.
          </Text>
        </Box>

        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Button
            type="button"
            variant="solid"
            color="indigo"
            onClick={handleOpen}
            className="cursor-pointer font-medium"
          >
            Select Products
          </Button>

          <Dialog.Content style={{ maxWidth: 350 }}>
            <Dialog.Title>Select Top Selling Products</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Choose manual products or fallbacks to show in this section (Max {maxLimit}).
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <TextField.Root
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>

              <Box className="max-h-[300px] overflow-y-auto pr-1 border border-gray-100 rounded-md">
                <Flex direction="column" gap="2" p="1">
                  {filteredProducts.length === 0 ? (
                    <Text size="2" color="gray" className="italic text-center py-4">
                      No products found.
                    </Text>
                  ) : (
                    filteredProducts.map((product) => {
                      const isChecked = tempSelected.includes(product.id);
                      const imageUrl = product.images?.[0] || '';
                      return (
                        <Card
                          key={product.id}
                          size="1"
                          className={`cursor-pointer transition-colors ${isChecked ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'}`}
                          onClick={() => handleToggle(product.id)}
                        >
                          <Flex align="center" justify="between" gap="3">
                            <Flex align="center" gap="3">
                              <Box className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {imageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Flex align="center" justify="center" className="w-full h-full text-gray-400 text-[10px]">
                                    No img
                                  </Flex>
                                )}
                              </Box>
                              <Box>
                                <Text size="2" weight="bold" className="block line-clamp-1">{product.name}</Text>
                                <Text size="1" color="gray">Price: ₹{product.price}</Text>
                              </Box>
                            </Flex>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => handleToggle(product.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Flex>
                        </Card>
                      );
                    })
                  )}
                </Flex>
              </Box>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" className="cursor-pointer">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button variant="solid" color="indigo" onClick={handleSave} className="cursor-pointer font-medium">
                Save Selection ({tempSelected.length})
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      {/* Selected Products Table */}
      {selectedIds.length === 0 ? (
        <Box className="py-6 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center">
          <Text size="2" color="gray" className="italic">
            No products selected. Click &quot;Select Products&quot; to pick some.
          </Text>
        </Box>
      ) : (
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
                          onClick={() => handleRemove(id)}
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
      )}
    </Box>
  );
}
