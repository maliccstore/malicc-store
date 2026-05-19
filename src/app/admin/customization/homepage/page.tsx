'use client';

import HomepageCustomizer from '@/components/admin/customization/HomepageCustomizer';
import { Container } from '@radix-ui/themes';

export default function HomepageCustomizationPage() {
  return (
    <Container size="3" p="4" className="py-8">
      <HomepageCustomizer />
    </Container>
  );
}
