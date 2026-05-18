'use client';

import { Container, Flex, Box } from '@radix-ui/themes';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdaptiveLogo from '../ui/AdaptiveLogo';
import ThemeToggle from '../ui/ThemeToggle';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchAppearance } from '@/store/admin/settings/appearanceThunks';
import { useAppDispatch } from '@/store/hooks';

export default function Header() {
  // Hydration
  const [isMounted, setIsMounted] = useState(false);
  const appearance = useSelector((state: RootState) => state.adminAppearance?.settings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);
    if (!appearance) {
      dispatch(fetchAppearance());
    }
  }, [dispatch, appearance]);

  if (!isMounted) return null;

  return (
    <header>
      <Container style={{ margin: '5px' }}>
        <Flex justify={'between'} align={'center'}>
          <Link href={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Flex 
              align="center" 
              gap="3" 
              direction={
                appearance?.logo_position === 'right' ? 'row-reverse' : 
                appearance?.logo_position === 'center' ? 'column' : 
                'row'
              }
              style={{ textAlign: appearance?.logo_position === 'center' ? 'center' : 'left' }}
            >
              <AdaptiveLogo />
              {(appearance?.store_name || appearance?.tagline) && (
                <Box>
                  {appearance?.store_name && (
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {appearance.store_name}
                    </div>
                  )}
                  {appearance?.tagline && (
                    <div style={{ color: 'gray', fontSize: '0.8rem' }}>
                      {appearance.tagline}
                    </div>
                  )}
                </Box>
              )}
            </Flex>
          </Link>
          <ThemeToggle />
        </Flex>
      </Container>
    </header>
  );
}
