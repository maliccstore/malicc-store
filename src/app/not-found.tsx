'use client';

import Link from 'next/link';
import { Container, Flex, Heading, Text } from '@radix-ui/themes';
import { ShoppingBag, Home } from 'lucide-react';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';
import { Button } from '@/components/ui/Button';

export default function Custom404() {
  return (
    <Flex minHeight="100vh" direction="column">
      <Header />

      <Container p="4" flexGrow="1">
        <Flex
          direction="column"
          align="center"
          justify="center"
          className="h-full py-20 text-center animate-fade-in-up"
        >
          {/* Illustration Section */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 scale-150" />
            <div className="relative bg-white p-8 rounded-full shadow-xl border border-blue-50">
              <ShoppingBag size={80} className="text-blue-600" strokeWidth={1.5} />
              <div className="absolute -bottom-2 -right-2 bg-red-100 p-3 rounded-full border-4 border-white">
                <Text size="8" className="font-bold text-red-600 leading-none">
                  ?
                </Text>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <Heading size="8" mb="2" className="font-bold tracking-tight">
            Page Not Found
          </Heading>

          <Text size="4" color="gray" mb="8" className="max-w-[300px]">
            Oops! The page you are looking for doesn&apos;t exist.
          </Text>

          {/* CTA Group */}
          <Flex gap="3" direction="column" className="w-full max-w-[280px]">
            <Link href="/" passHref className="w-full">
              <Button className="w-full flex items-center justify-center gap-2">
                <Home size={18} />
                Go Back Home
              </Button>
            </Link>

            <Link href="/explore" passHref className="w-full">
              <Button variant="outline" size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </Flex>

          <Text size="2" color="gray" mt="8" className="opacity-50 italic">
            Error Code: 404 - LOST_IN_SPACE
          </Text>
        </Flex>
      </Container>

      <BottomNavigation />
    </Flex>
  );
}
