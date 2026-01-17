// src/app/layout.tsx

import type { Metadata, Viewport } from 'next';
import '../globals.css';
import '@radix-ui/themes/styles.css';

import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';

import { Flex, Container } from '@radix-ui/themes';

export const metadata: Metadata = {
  title: 'Malicc Store',
  description: 'An Ecommerce Store for all',
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default function PublicRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex minHeight="100vh" direction="column">
      <Header />

      <Container p="4" flexGrow="1">
        {children}
      </Container>

      <BottomNavigation />
    </Flex>
  );
}
