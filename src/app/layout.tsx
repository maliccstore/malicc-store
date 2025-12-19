// app/layout.js (App Router - Root Layout)
import './globals.css';
import { Container } from '@radix-ui/themes';
import { Providers } from '@/provider/app/Provider';

export const metadata = {
  title: 'Admin panel for malicc',
  description: 'A modern application for modern sellers ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={` antialiased h-full bg-slate-200  `}>
        <Container className="mobile-only  pb-20   max-h-screen z-10 border-2 border-slate-700">
          <Providers>{children}</Providers>
        </Container>
      </body>
    </html>
  );
}
