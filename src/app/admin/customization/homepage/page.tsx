'use client';

import HomepageCustomizer from '@/components/admin/customization/HomepageCustomizer';
import { Container } from '@radix-ui/themes';

export default function HomepageCustomizationPage() {
  return (
    <Container size="4" p="4" className="py-8 max-w-[1200px] w-full">
      <HomepageCustomizer />
    </Container>
  );
}
