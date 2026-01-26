'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../store';
import { useAppSelector } from '@/store/hooks';
import { loadUserThunk } from '@/store/slices/authSlice';
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

  // Initialize user session if token exists
  if (!storeRef.current) {
    storeRef.current = makeStore();
    const state = storeRef.current.getState();
    if (state.auth.token) {
      storeRef.current.dispatch(loadUserThunk());
    }
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
