import React, { useState } from 'react';
import { Flex, Text, Button, TextField, Checkbox, Box, Dialog, Card } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { AdminProduct } from '@/features/admin/products/product.types';

interface FeaturedProductPickerProps {
  products: AdminProduct[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  maxLimit?: number;
}

export default function FeaturedProductPicker({
  products,
  selectedIds,
  onSelect,
  maxLimit = 12,
}: FeaturedProductPickerProps) {
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
        alert(`You can select a maximum of ${maxLimit} featured products.`);
        return;
      }
      setTempSelected([...tempSelected, id]);
    }
  };

  const handleSave = () => {
    onSelect(tempSelected);
    setIsOpen(false);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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

      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>Select Featured Products</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Select products to display in the Featured section on the homepage (Max {maxLimit}).
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
  );
}
