'use client';

import { redirect, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuthActions';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';
import { Flex, Container } from '@radix-ui/themes';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname]);

  return (
    <Flex minHeight="100vh" direction="column">
      <Header />

      <Container p="4" flexGrow="1">
        {isLoading ? (
          <Flex align="center" justify="center" height="full">
            Loading...
          </Flex>
        ) : (
          children
        )}
      </Container>

      <BottomNavigation />
    </Flex>
  );
}
