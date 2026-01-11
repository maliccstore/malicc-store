'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import ProductCard from '@/components/products/ProductCard';
import { Box, Container, Flex, Heading, Text, Select, Grid, TextField } from '@radix-ui/themes';
import { Search, Frown } from 'lucide-react';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products } = useAppSelector((state) => state.products);

  // State for local input value to control the input field
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState('relevance');

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
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => Number(b.rating) - Number(a.rating));
  }

  return (
    <Container size="2" p="4">
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

          {/* Search Input and Sort */}
          <Flex direction={{ initial: 'column', sm: 'row' }} justify="between" align="center" gap="4">
            <Box className="w-full sm:w-auto flex-grow">
              <TextField.Root
                placeholder="Search based on your keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              >
                <TextField.Slot>
                  <Search height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </Box>

            <Flex align="center" gap="2" className="w-full sm:w-auto shrink-0 justify-end">
              <Text size="2" weight="medium">Sort by:</Text>
              <Select.Root value={sortBy} onValueChange={setSortBy}>
                <Select.Trigger placeholder="Sort by" />
                <Select.Content>
                  <Select.Item value="relevance">Relevance</Select.Item>
                  <Select.Item value="price-asc">Price: Low to High</Select.Item>
                  <Select.Item value="price-desc">Price: High to Low</Select.Item>
                  <Select.Item value="rating">Top Rated</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Flex>

        {/* Results Section - Single Column */}
        {filteredProducts.length > 0 ? (
          <Grid columns="1" gap="4" width="auto">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        ) : (
          <Flex direction="column" align="center" justify="center" py="9" gap="4" className="bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Frown size={48} className="text-gray-400" />
            <Heading size="4" color="gray">No results found for &quot;{query}&quot;</Heading>
            <Text color="gray" align="center" style={{ maxWidth: 400 }}>
              Try checking your spelling or use different keywords.
            </Text>
          </Flex>
        )}
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
