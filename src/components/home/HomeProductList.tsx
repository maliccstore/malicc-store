'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productSlice';
import ProductCard from '@/components/products/ProductCard';
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton';
import { Grid, Box, Heading, Flex, Text, Button } from '@radix-ui/themes';
import { Frown } from 'lucide-react';

export default function HomeProductList() {
    const dispatch = useAppDispatch();
    const { products, loading, error } = useAppSelector((state) => state.products);

    useEffect(() => {
        // Fetch all products (no filters)
        dispatch(fetchProducts({}));
    }, [dispatch]);

    if (loading) {
        return (
            <Box className="w-full">
                <Grid gap="4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) {
        return (
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
                <Button onClick={() => dispatch(fetchProducts({}))} variant="soft" color="red">
                    Try Again
                </Button>
            </Flex>
        );
    }

    if (products.length === 0) {
        return (
            <Flex
                direction="column"
                align="center"
                justify="center"
                py="9"
                gap="4"
                className="bg-gray-50 rounded-lg border border-dashed border-gray-300"
            >
                <Heading size="4" color="gray">
                    No products found
                </Heading>
            </Flex>
        )
    }

    return (
        <Box className="w-full">
            <Grid gap="4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Grid>
        </Box>
    );
}
