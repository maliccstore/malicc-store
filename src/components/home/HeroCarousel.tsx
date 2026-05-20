'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Heading, Text, Button, Container } from '@radix-ui/themes';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Banner } from '@/types/homepage';

interface HeroCarouselProps {
    banners?: Banner[];
}

export default function HeroCarousel({ banners = [] }: HeroCarouselProps) {
    const activeBanners = banners.filter(b => b.active);
    const slides = activeBanners;

    const [currentSlide, setCurrentSlide] = useState(0);
    const router = useRouter();

    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, slides.length]);

    const handleRedirect = (url?: string) => {
        if (!url) return;
        router.push(url);
    };

    // Keyboard accessibility
    useEffect(() => {
        if (slides.length === 0) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide, slides.length]);

    // Touch support (swipe)
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    // Only show when there is data from the backend
    if (activeBanners.length === 0) {
        return null;
    }

    return (
        <Box 
            className="relative w-full h-[80vh] overflow-hidden bg-gray-900"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {slides.map((slide, index) => (
                <Box
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Image Background */}
                    <div className="absolute inset-0">
                        <Image
                            src={slide.image}
                            alt={slide.title || 'Hero Banner Image'}
                            fill
                            className="object-cover opacity-60"
                            priority={index === 0}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <Container size="4" className="h-full relative z-20">
                        <Flex
                            direction="column"
                            justify="center"
                            align="center"
                            className="h-full max-w-2xl px-6 mx-auto text-center space-y-6 sm:items-start sm:text-left sm:mx-0 sm:px-8"
                        >
                            <div
                                className={`transition-all duration-500 ease-out ${index === currentSlide ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-5'}`}
                            >
                                <Heading
                                    size="9"
                                    className="text-white font-bold tracking-tight mb-4 drop-shadow-lg"
                                    style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: 1.1 }}
                                >
                                    {slide.title}
                                </Heading>
                            </div>

                            {slide.subtitle && (
                                <Text
                                    size="5"
                                    className="text-gray-100 mb-8 max-w-lg drop-shadow-md"
                                    weight="medium"
                                    style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}
                                >
                                    {slide.subtitle}
                                </Text>
                            )}

                            {slide.ctaText && slide.redirectUrl && (
                                <Button
                                    size="4"
                                    variant="solid"
                                    color="indigo"
                                    className="cursor-pointer font-semibold px-8 py-6 rounded-full transition-transform hover:scale-105"
                                    onClick={() => handleRedirect(slide.redirectUrl)}
                                    aria-label={slide.ctaText}
                                >
                                    {slide.ctaText}
                                </Button>
                            )}
                        </Flex>
                    </Container>
                </Box>
            ))}

            {/* Navigation Controls */}
            {slides.length > 1 && (
                <>
                    <Flex className="absolute bottom-8 right-4 sm:right-8 z-30 gap-4">
                        <Button
                            variant="soft"
                            onClick={prevSlide}
                            className="rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                            aria-label="Previous slide"
                        >
                            <ArrowLeftIcon width="20" height="20" />
                        </Button>
                        <Button
                            variant="soft"
                            onClick={nextSlide}
                            className="rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                            aria-label="Next slide"
                        >
                            <ArrowRightIcon width="20" height="20" />
                        </Button>
                    </Flex>

                    {/* Progress Indicators */}
                    <Flex className="absolute bottom-8 left-4 sm:left-1/2 sm:-translate-x-1/2 z-30 gap-2 sm:gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 sm:w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </Flex>
                </>
            )}
        </Box>
    );
}

