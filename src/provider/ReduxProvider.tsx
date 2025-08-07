'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../store';
import { useAppSelector } from '@/store/hooks';
import { Theme } from '@radix-ui/themes';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  if (!storeRef.current) {
    throw new Error('Store initialization failed');
  }

  return (
    <Provider store={storeRef.current}>
      <ThemeWrapper>{children}</ThemeWrapper>
    </Provider>
  );
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.app.theme);

  return (
    <Theme grayColor="olive" radius="full" appearance={theme}>
      {children}
    </Theme>
  );
}
