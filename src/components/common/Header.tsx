'use client';

import { Container, Flex } from '@radix-ui/themes';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdaptiveLogo from '../ui/AdaptiveLogo';
import ThemeToggle from '../ui/ThemeToggle';

export default function Header() {
  // Hydration
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Hydration
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <header>
      <Container style={{ margin: '5px' }}>
        <Flex justify={'between'} align={'center'}>
          <Link href={'/'}>
            <AdaptiveLogo />
          </Link>
          <ThemeToggle />
        </Flex>
      </Container>
    </header>
  );
}
