'use client';

import HeroCarousel from '@/components/home/HeroCarousel';
import HomeProductList from '@/components/home/HomeProductList';
import { Container, Heading, Flex, Box, Separator } from '@radix-ui/themes';

export default function HomePage() {
    return (
        <Box className="pb-10">
            {/* Hero Section */}
            <Box className="mb-8 sm:mb-12">
                <HeroCarousel />
            </Box>

            {/* Main Content */}
            <Container size="4" className="px-4">
                <Flex direction="column" gap="6">
                    <Flex direction="column" align="center" gap="2" className="mb-4">
                        <Heading size="8" className="font-light tracking-tight text-center">
                            Our Products
                        </Heading>
                        <Separator size="4" className="w-24 bg-gray-300" />
                    </Flex>

                    <HomeProductList />
                </Flex>
            </Container>
        </Box>
    );
}
