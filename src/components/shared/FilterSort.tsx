'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, Checkbox, Flex, Heading, Select, Text, TextField, Grid } from '@radix-ui/themes';
import { categoryService } from '@/services/category.service';
import { Category } from '@/types/category';
import { trackEvent } from '@/services/analytics/analytics.service';
import { getSessionId } from '@/services/analytics/session';
import { ANALYTICS_EVENTS } from '@/constants';
import { useAppSelector } from '@/store/hooks';

interface FilterSortProps {
    onApply?: () => void;
}

export default function FilterSort(props: FilterSortProps) {
    return (
        <Suspense fallback={<Box>Loading filters...</Box>}>
            <FilterSortContent {...props} />
        </Suspense>
    );
}

function FilterSortContent({ onApply }: FilterSortProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useAppSelector((state) => state.auth.user);

    const [categories, setCategories] = useState<Category[]>([]);

    // Local state for all filters
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'all');
    const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
    const [sort, setSort] = useState(searchParams.get('sort') || 'relevance');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    // Track previous applied values to diff on apply
    const prevApplied = useRef({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || 'all',
        inStock: searchParams.get('inStock') === 'true',
        sort: searchParams.get('sort') || 'relevance',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
    });

    useEffect(() => {
        const loadCategories = async () => {
            const data = await categoryService.getAll({ isActive: true });
            setCategories(data);
        };
        loadCategories();
    }, []);

    // Sync state with URL when URL changes (e.g. navigation / back button)
    useEffect(() => {
        setSearch(searchParams.get('search') || '');
        setCategory(searchParams.get('category') || 'all');
        setInStock(searchParams.get('inStock') === 'true');
        setSort(searchParams.get('sort') || 'relevance');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    // Debounced search tracking
    useEffect(() => {
        if (!search || search.trim() === '') return;
        
        // Don't track if the search matches what's already in the URL 
        // to prevent duplicate tracking on page load
        if (search === searchParams.get('search')) return;

        const timer = setTimeout(() => {
            trackEvent({
                event: ANALYTICS_EVENTS.SEARCH,
                sessionId: getSessionId(),
                userId: user?.id,
                metadata: { query: search.trim() },
            });
        }, 800);

        return () => clearTimeout(timer);
    }, [search, user?.id, searchParams]);

    const handleApply = () => {
        const prev = prevApplied.current;
        const sessionId = getSessionId();
        const userId = user?.id;

        // Track SORT_APPLIED if sort changed
        if (sort !== prev.sort) {
            trackEvent({
                event: ANALYTICS_EVENTS.SORT_APPLIED,
                sessionId,
                userId,
                metadata: { sort },
            });
        }

        // Track FILTER_APPLIED if any filter changed
        if (
            category !== prev.category ||
            inStock !== prev.inStock ||
            minPrice !== prev.minPrice ||
            maxPrice !== prev.maxPrice
        ) {
            trackEvent({
                event: ANALYTICS_EVENTS.FILTER_APPLIED,
                sessionId,
                userId,
                metadata: {
                    category: category !== 'all' ? category : undefined,
                    inStock: inStock || undefined,
                    minPrice: minPrice ? Number(minPrice) : undefined,
                    maxPrice: maxPrice ? Number(maxPrice) : undefined,
                },
            });
        }

        // Persist current values as the new baseline
        prevApplied.current = { search, category, inStock, sort, minPrice, maxPrice };

        const params = new URLSearchParams(searchParams.toString());

        // Helper to set/delete
        const setParam = (key: string, value: string | null) => {
            if (value === null || value === '' || value === 'all') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        };

        setParam('search', search);
        setParam('category', category);
        setParam('inStock', inStock ? 'true' : null);
        setParam('sort', sort);
        setParam('minPrice', minPrice);
        setParam('maxPrice', maxPrice);

        router.push(`?${params.toString()}`, { scroll: false });

        if (onApply) {
            onApply();
        }
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('all');
        setInStock(false);
        setSort('relevance');
        setMinPrice('');
        setMaxPrice('');
    };

    return (
        <Box>
            <Flex justify="between" align="center" mb="4">
                <Heading size="3">Filters</Heading>
                <Button variant="ghost" size="1" onClick={clearFilters}>Clear</Button>
            </Flex>

            <Grid columns={{ initial: '1', md: '2' }} gap="4" width="auto">
                {/* Search */}
                <Box className="md:col-span-2">
                    <Text size="2" weight="bold" mb="2" as="div">Search</Text>
                    <TextField.Root
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Box>

                {/* Sorting */}
                <Box>
                    <Text size="2" weight="bold" mb="2" as="div">Sort By</Text>
                    <Select.Root value={sort} onValueChange={setSort}>
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
                    <Select.Root value={category} onValueChange={setCategory}>
                        <Select.Trigger className="w-full" placeholder="Select Category" />
                        <Select.Content>
                            <Select.Item value="all">All Categories</Select.Item>
                            {categories.map((cat) => (
                                <Select.Item key={cat.id} value={cat.id}>
                                    {cat.name}
                                </Select.Item>
                            ))}
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
                                onCheckedChange={(checked) => setInStock(!!checked)}
                            />
                            In Stock Only
                        </Flex>
                    </Text>
                </Box>

                {/* Apply Button */}
                <Button size="3" variant="solid" onClick={handleApply} className="w-full mt-4">
                    Show Results
                </Button>

            </Grid>
        </Box>
    );
}
