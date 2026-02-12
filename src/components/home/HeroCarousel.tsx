'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Button, Container } from '@radix-ui/themes';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';


// TODO: Add dynamic slides
const SLIDES = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop', // Shop interior / clothes
        title: 'New Season Arrivals',
        subtitle: 'Discover the latest trends for the upcoming season.',
        cta: 'Shop Now',
        link: '/new',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop', // Fashion model
        title: 'Exclusive Collection',
        subtitle: 'Premium quality materials for your everyday comfort.',
        cta: 'View Collection',
        link: '/explore',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop', // Coats
        title: 'Winter Essentials',
        subtitle: 'Stay warm and stylish with our winter selection.',
        cta: 'Shop Winter',
        link: '/explore?category=winter',
    },
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    };

    return (
        <Box className="relative w-full h-[80vh] overflow-hidden bg-gray-900">
            {SLIDES.map((slide, index) => (
                <Box
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Image Background */}
                    <div className="absolute inset-0">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover opacity-60"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <Container size="4" className="h-full relative z-20">
                        <Flex
                            direction="column"
                            justify="center"
                            align="center" // Center align for mobile focus
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

                            <Text
                                size="5"
                                className="text-gray-100 mb-8 max-w-lg drop-shadow-md"
                                weight="medium"
                                style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}
                            >
                                {slide.subtitle}
                            </Text>

                            <Button
                                size="4"
                                variant="solid"
                                color="indigo"
                                className="cursor-pointer font-semibold px-8 py-6 rounded-full transition-transform hover:scale-105"
                                onClick={() => router.push(slide.link)}
                            >
                                {slide.cta}
                            </Button>
                        </Flex>
                    </Container>
                </Box>
            ))}

            {/* Navigation Controls - Hidden on very small screens if needed, or kept small */}
            <Flex className="absolute bottom-8 right-4 sm:right-8 z-30 gap-4">
                <Button
                    variant="soft"
                    onClick={prevSlide}
                    className="rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                >
                    <ArrowLeftIcon width="20" height="20" />
                </Button>
                <Button
                    variant="soft"
                    onClick={nextSlide}
                    className="rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                >
                    <ArrowRightIcon width="20" height="20" />
                </Button>
            </Flex>

            {/* Progress Indicators */}
            <Flex className="absolute bottom-8 left-4 sm:left-1/2 sm:-translate-x-1/2 z-30 gap-2 sm:gap-3">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 sm:w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </Flex>
        </Box>
    );
}

