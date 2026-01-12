'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, Checkbox, Flex, Heading, Select, Text, TextField, Grid } from '@radix-ui/themes';

export default function FilterSort() {
    return (
        <Suspense fallback={<Box>Loading filters...</Box>}>
            <FilterSortContent />
        </Suspense>
    );
}

function FilterSortContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get('q');

    // Derived state from URL for instant updates
    const category = searchParams.get('category') || 'all';
    const inStock = searchParams.get('inStock') === 'true';
    const sort = searchParams.get('sort') || 'relevance';

    // Local state for debounced inputs
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    // Sync local price state with URL if URL changes (e.g. clear filters or back button)
    // We check if the values differ significantly to avoid interrupting typing if possible,
    // but simpler to just sync when params change.
    useEffect(() => {
        const urlMin = searchParams.get('minPrice') || '';
        const urlMax = searchParams.get('maxPrice') || '';
        if (urlMin !== minPrice) setMinPrice(urlMin);
        if (urlMax !== maxPrice) setMaxPrice(urlMax);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Debounce price updates
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentMin = searchParams.get('minPrice') || '';
            const currentMax = searchParams.get('maxPrice') || '';

            // Only update if changed to avoid redundant pushes
            if (minPrice !== currentMin || maxPrice !== currentMax) {
                updateParams({ minPrice, maxPrice });
            }
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minPrice, maxPrice]);

    const updateParams = (updates: Record<string, string | boolean | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '' || value === 'all') {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        router.push(`?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        // Create new params preserving 'q'
        const newParams = new URLSearchParams();
        if (q) newParams.set('q', q);

        router.push(`?${newParams.toString()}`, { scroll: false });
    };

    const handleCategoryChange = (val: string) => {
        updateParams({ category: val });
    };

    const handleInStockChange = (checked: boolean) => {
        updateParams({ inStock: checked ? 'true' : null });
    };

    const handleSortChange = (val: string) => {
        updateParams({ sort: val });
    };

    return (
        <Box className="w-full mb-6 border-b pb-6">
            <Flex justify="between" align="center" mb="4">
                <Heading size="3">Filters</Heading>
                <Button variant="ghost" size="1" onClick={clearFilters}>Clear</Button>
            </Flex>

            <Grid columns={{ initial: '1', md: '2' }} gap="4" width="auto">
                {/* Sorting */}
                <Box>
                    <Text size="2" weight="bold" mb="2" as="div">Sort By</Text>
                    <Select.Root value={sort} onValueChange={handleSortChange}>
                        <Select.Trigger className="w-full" placeholder="Sort by..." />
                        <Select.Content>
                            <Select.Item value="relevance">Relevance</Select.Item>
                            <Select.Item value="price-asc">Price: Low to High</Select.Item>
                            <Select.Item value="price-desc">Price: High to Low</Select.Item>
                            <Select.Item value="rating">Top Rated</Select.Item>
                            <Select.Item value="newest">Newest Arrivals</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Box>

                {/* Category Filter */}
                <Box>
                    <Text size="2" weight="bold" mb="2" as="div">Category</Text>
                    <Select.Root value={category} onValueChange={handleCategoryChange}>
                        <Select.Trigger className="w-full" placeholder="Select Category" />
                        <Select.Content>
                            <Select.Item value="all">All Categories</Select.Item>
                            <Select.Item value="Electronics">Electronics</Select.Item>
                            <Select.Item value="Fitness">Fitness</Select.Item>
                            <Select.Item value="Home">Home</Select.Item>
                            <Select.Item value="Accessories">Accessories</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Box>

                {/* Price Filter */}
                <Box>
                    <Text size="2" weight="bold" mb="2" as="div">Price Range</Text>
                    <Flex gap="2">
                        <TextField.Root
                            placeholder="Min"
                            type="number"
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)}
                        />
                        <TextField.Root
                            placeholder="Max"
                            type="number"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                        />
                    </Flex>
                </Box>

                {/* Availability Filter */}
                <Box className="flex items-end pb-2">
                    <Text as="label" size="2">
                        <Flex gap="2" align="center">
                            <Checkbox
                                checked={inStock}
                                onCheckedChange={handleInStockChange}
                            />
                            In Stock Only
                        </Flex>
                    </Text>
                </Box>
            </Grid>
        </Box>
    );
}
