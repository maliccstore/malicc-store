'use client';

import { Box, Container, Skeleton } from '@radix-ui/themes';

export default function ProductDetailsSkeleton() {
    return (
        <Container className="product-page p-4">
            <Box className="w-full h-64 mb-6">
                <Skeleton className="w-full h-full rounded-lg" />
            </Box>
            <div>
                {/* Title */}
                <Skeleton className="h-8 w-3/4" />
                {/* Price with margin y-4 */}
                <Skeleton className="h-7 w-24 my-4" />
                {/* Description */}
                <div className="space-y-2 text-gray-700">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>
            <div className="sticky bottom-12 flex justify-center pt-4">
                <Skeleton className="h-10 w-full max-w-md rounded" />
            </div>
        </Container>
    );
}
