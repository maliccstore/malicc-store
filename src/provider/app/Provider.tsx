// Create app/providers.tsx
'use client';

import ReduxProvider from '@/provider/ReduxProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
