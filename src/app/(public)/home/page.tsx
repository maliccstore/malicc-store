'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHomepageConfig } from '@/store/slices/productSlice';
import HeroCarousel from '@/components/home/HeroCarousel';
import HomeProductList from '@/components/home/HomeProductList';
import PromotionalBanner from '@/components/home/PromotionalBanner';
import HomepageSkeleton from '@/components/home/HomepageSkeleton';
import { getDefaultHomepageConfig } from '@/utils/homepage/getDefaultHomepageConfig';
import { Container, Heading, Flex, Box, Button, Text } from '@radix-ui/themes';
import { Frown } from 'lucide-react';

export default function HomePage() {
    const dispatch = useAppDispatch();
    const { 
        homepagePayload, 
        homepageLoading, 
        homepageError 
    } = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchHomepageConfig());
    }, [dispatch]);

    const handleRetry = () => {
        dispatch(fetchHomepageConfig());
    };

    if (homepageLoading && !homepagePayload) {
        return <HomepageSkeleton />;
    }

    if (homepageError && !homepagePayload) {
        return (
            <Container size="4" className="py-12 px-6 sm:px-8">
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
                        Failed to load homepage
                    </Heading>
                    <Text color="red" align="center">
                        {homepageError}
                    </Text>
                    <Button onClick={handleRetry} variant="soft" color="red">
                        Try Again
                    </Button>
                </Flex>
            </Container>
        );
    }

    // Graceful Degradation: Fallback to defaults if payload is empty/missing
    const payload = homepagePayload || getDefaultHomepageConfig();
    const config = payload.config;

    return (
        <Box className="pb-10">
            {config.sectionOrder.map((section) => {
                switch (section) {
                    case 'hero':
                        return (
                            <Box key="hero-section" className="mb-8 sm:mb-12">
                                <HeroCarousel banners={config.heroBanners} />
                            </Box>
                        );
                    case 'featured':
                        if (!config.featuredProducts?.enabled) return null;
                        return (
                            <HomeProductList 
                                key="featured-section"
                                title="Featured Products" 
                                products={payload.featuredProducts} 
                                loading={homepageLoading}
                            />
                        );
                    case 'topSelling':
                        if (!config.topSelling?.enabled) return null;
                        return (
                            <HomeProductList 
                                key="topselling-section"
                                title="Top Selling Products" 
                                products={payload.topSellingProducts} 
                                loading={homepageLoading}
                            />
                        );
                    case 'newArrivals':
                        if (!config.newArrivals?.enabled) return null;
                        return (
                            <HomeProductList 
                                key="newarrivals-section"
                                title="New Arrivals" 
                                products={payload.newArrivals} 
                                loading={homepageLoading}
                            />
                        );
                    case 'promotional':
                        return (
                            <PromotionalBanner 
                                key="promotional-section"
                                blocks={config.promotionalBanners} 
                            />
                        );
                    default:
                        return null;
                }
            })}
        </Box>
    );
}
