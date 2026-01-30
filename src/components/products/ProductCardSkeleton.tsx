'use client';

import { Card, Flex, Skeleton, Box } from '@radix-ui/themes';

export default function ProductCardSkeleton() {
    return (
        <Card className="m-2 w-full max-w-xs overflow-hidden">
            {/* Image Skeleton */}
            <Box className="relative aspect-square w-full">
                <Skeleton width="100%" height="100%" />
            </Box>

            <Box className="p-4 space-y-3">
                <Box>
                    {/* Title Skeleton */}
                    <Skeleton width="80%" height="24px" className="mb-2" />

                    {/* Description Skeleton (2 lines) */}
                    <Skeleton width="100%" height="16px" className="mb-1" />
                    <Skeleton width="90%" height="16px" />
                </Box>

                <Flex align="center" justify="between" pt="2">
                    {/* Price Skeleton */}
                    <Skeleton width="60px" height="24px" />

                    {/* Button Skeleton */}
                    <Skeleton width="100px" height="32px" />
                </Flex>
            </Box>
        </Card>
    );
}
