'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import ProductCard from '@/components/products/ProductCard';
import { Box, Container, Flex, Heading, Text, Grid, TextField } from '@radix-ui/themes';
import { Search, Frown } from 'lucide-react';
import FilterSort from '@/components/shared/FilterSort';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products } = useAppSelector((state) => state.products);

  // Filter params
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || Infinity;
  const category = searchParams.get('category') || 'all';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'relevance';

  // State for local input value to control the input field
  const [searchTerm, setSearchTerm] = useState(query);

  // Debounce search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== query) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
          params.set('q', searchTerm);
        } else {
          params.delete('q');
        }
        router.push(`/search?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, router, searchParams, query]);

  // Update local state if URL changes externally
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // Filter and Sort Logic (calculated on every render)
  const filteredProducts = products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const matchesCategory = category === 'all' || product.category === category;
    const matchesStock = !inStockOnly || product.inStock;

    return matchesQuery && matchesPrice && matchesCategory && matchesStock;
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
      <Flex direction="column" gap="6">

        {/* Header Section */}
        <Flex direction="column" gap="4" className="border-b pb-4">
          <Box>
            <Heading size="6" mb="2" className="uppercase tracking-wide">
              Search Results
            </Heading>
            <Text color="gray" size="2">
              {filteredProducts.length} results for &quot;{query}&quot;
            </Text>
          </Box>

          {/* Search Input */}
          <Box className="w-full">
            <TextField.Root
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <TextField.Slot>
                <Search height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Box>
        </Flex>

        <Flex direction="column" gap="6" align="start">
          {/* Filter Top Bar */}
          <Box width="100%" flexShrink="0">
            <FilterSort />
          </Box>

          {/* Results Section */}
          <Box className="w-full">
            {filteredProducts.length > 0 ? (
              <Grid columns="1" gap="4" width="auto">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Grid>
            ) : (
              <Flex direction="column" align="center" justify="center" py="9" gap="4" className="bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Frown size={48} className="text-gray-400" />
                <Heading size="4" color="gray">No results found</Heading>
                <Text color="gray" align="center" style={{ maxWidth: 400 }}>
                  Try removing some filters or use different keywords.
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>

      </Flex>
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
