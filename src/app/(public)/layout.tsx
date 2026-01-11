// src/app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import '@radix-ui/themes/styles.css';

import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';

import { Box, Container } from '@radix-ui/themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-slate-200 `}
      >
        <Container className="mobile-only overflow-scroll pb-20   max-h-screen z-10">
          <Header />

          <Container>
            <Box>{children}</Box>
          </Container>

          
        </Container>
        <BottomNavigation />
      </body>
    </html>
  );
}
