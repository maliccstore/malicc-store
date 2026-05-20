import React from 'react';
import { Box, Flex, Container, Grid, Skeleton } from '@radix-ui/themes';

export function HeroCarouselSkeleton() {
    return (
        <Box className="w-full h-[80vh] bg-gray-200 relative flex items-center">
            <Container size="4" className="relative z-10 px-6 sm:px-8">
                <Flex direction="column" gap="4" align="start" className="max-w-2xl">
                    <Skeleton width="60%" height="48px" />
                    <Skeleton width="40%" height="24px" />
                    <Skeleton width="120px" height="40px" className="mt-4" />
                </Flex>
            </Container>
        </Box>
    );
}

export function ProductListSkeleton() {
    return (
        <Container size="4" className="py-8 px-6 sm:px-8">
            <Skeleton width="200px" height="28px" className="mb-6" />
            <Box className="w-full overflow-x-auto pb-4 scrollbar-hide">
                <Flex gap="4" className="w-max">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Box key={i} className="w-[280px] sm:w-[320px] flex-shrink-0">
                            <Box className="bg-gray-100 rounded-xl p-4 space-y-4">
                                <Skeleton width="100%" height="200px" />
                                <Skeleton width="80%" height="20px" />
                                <Skeleton width="40%" height="16px" />
                            </Box>
                        </Box>
                    ))}
                </Flex>
            </Box>
        </Container>
    );
}

export function PromotionalBannerSkeleton() {
    return (
        <Container size="4" className="py-8 px-6 sm:px-8">
            <Grid columns={{ initial: '1', md: '2' }} gap="6">
                <Skeleton width="100%" height="220px" className="rounded-2xl" />
                <Skeleton width="100%" height="220px" className="rounded-2xl" />
            </Grid>
        </Container>
    );
}

export default function HomepageSkeleton() {
    return (
        <Box className="space-y-4">
            <HeroCarouselSkeleton />
            <ProductListSkeleton />
            <PromotionalBannerSkeleton />
            <ProductListSkeleton />
        </Box>
    );
}
