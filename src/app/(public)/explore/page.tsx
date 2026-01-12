'use client';
import ProductCard from '@/components/products/ProductCard';
import { useAppSelector } from '@/store/hooks';
import { Box, Container, Flex, Grid, Heading, Text, Dialog, Button } from '@radix-ui/themes';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import FilterSort from '@/components/shared/FilterSort';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Frown } from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const { products } = useAppSelector((state) => state.products);

  // Filter params
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || Infinity;
  const category = searchParams.get('category') || 'all';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'relevance';

  // Filter and Sort Logic
  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const matchesCategory = category === 'all' || product.category === category;
    const matchesStock = !inStockOnly || product.inStock;

    return matchesPrice && matchesCategory && matchesStock;
  });

  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => Number(b.rating) - Number(a.rating));
  } else if (sortBy === 'newest') {
    filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return (
    <Container size="4" p="4">
      <Heading
        size="8"
        mb="6"
        className="font-light tracking-tight text-center"
      >
        EXPLORE
      </Heading>

      <Flex direction="column" gap="4" align="start">
        {/* Filter Button (Dialog Trigger) */}
        <Box width="100%" flexShrink="0" className="flex justify-end">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft" size="2">
                <MixerHorizontalIcon width="16" height="16" />
                Filters
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>Filter & Sort</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                Refine your product search.
              </Dialog.Description>

              <FilterSort />

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button>Show Results</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Box>

        {/* Products Section */}
        <Box className="w-full">
          {filteredProducts.length > 0 ? (
            <Grid columns="1" gap="4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py="9"
              gap="4"
              className="bg-gray-50 rounded-lg border border-dashed border-gray-300"
            >
              <Frown size={48} className="text-gray-400" />
              <Heading size="4" color="gray">
                No products found
              </Heading>
              <Text color="gray" align="center" style={{ maxWidth: 400 }}>
                Try changing your filters.
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Container>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
