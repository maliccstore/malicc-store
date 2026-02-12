'use client';
import ProductCard from '@/components/products/ProductCard';
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productSlice';
import { ProductFilterInput } from '@/types/product';
import { useEffect, useState } from 'react';
import { Box, Container, Flex, Grid, Heading, Text, Dialog, Button, Skeleton } from '@radix-ui/themes';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import FilterSort from '@/components/shared/FilterSort';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Frown } from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const filters: ProductFilterInput = {};

    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== 'all') {
      filters.category = categoryParam;
    }

    const minPrice = searchParams.get('minPrice');
    if (minPrice) filters.minPrice = Number(minPrice);

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) filters.maxPrice = Number(maxPrice);

    const inStock = searchParams.get('inStock');
    if (inStock === 'true') filters.isActive = true;

    dispatch(fetchProducts(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchParams.toString()]);

  // Sort Logic (Client-side for now)
  const sortBy = searchParams.get('sort') || 'relevance';

  // Create a copy to sort to avoid mutating read-only state if applicable
  const displayedProducts = [...products];

  if (sortBy === 'price-asc') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    displayedProducts.sort((a, b) => Number(b.rating) - Number(a.rating));
  } else if (sortBy === 'newest') {
    displayedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  if (loading) {
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
          {/* Skeleton Filter Button */}
          <Box width="100%" flexShrink="0" className="flex justify-end">
            <Skeleton width="80px" height="32px" />
          </Box>

          <Box className="w-full">
            <Grid columns="1" gap="4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </Grid>
          </Box>
        </Flex>
      </Container>
    );
  }


  if (error) {
    return (
      <Container size="4" p="4">
        <Flex
          direction="column"
          align="center"
          justify="center"
          py="9"
          gap="4"
          className="bg-red-50 rounded-lg border border-dashed border-red-300"
        >
          <Frown size={48} className="text-red-400" />
          <Heading size="4" color="red">
            Failed to load products
          </Heading>
          <Text color="red" align="center">
            {error}
          </Text>
          <Button onClick={() => dispatch(fetchProducts())} variant="soft" color="red">
            Try Again
          </Button>
        </Flex>
      </Container>
    );
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
          <Dialog.Root open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <Dialog.Trigger>
              <Button variant="soft" size="2">
                <MixerHorizontalIcon width="16" height="16" />
                Filters
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 400 }}>
              <Dialog.Title>Filter & Sort</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                Refine your product search.
              </Dialog.Description>

              <FilterSort onApply={() => setIsFilterOpen(false)} />
            </Dialog.Content>
          </Dialog.Root>
        </Box>

        {/* Products Section */}
        <Box className="w-full">
          {displayedProducts.length > 0 ? (
            <Grid columns="1" gap="4">
              {displayedProducts.map((product) => (
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
