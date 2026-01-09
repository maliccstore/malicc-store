'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { loadUserThunk } from '@/store/slices/authSlice';

/**
 * Custom hook to manage and check user authentication state via Redux
 */
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, token, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // If we have a token but no user loaded, try to load the user
    // We check !loading to avoid double dispatch if it's already in progress
    if (token && !user) {
      dispatch(loadUserThunk());
    }
  }, [dispatch, token, user]);

  // Determine if we are effectively loading.
  // We are loading if:
  // 1. Redux says we are loading (e.g. fetching user)
  // 2. We have a token but haven't loaded the user yet (initial hydration state)
  const isAuthCheckLoading = loading || (!!token && !user);

  // We return isLoading only if we are actually checking auth.
  // If there is no token, we are definitively NOT authenticated and NOT loading.
  const appIsLoading = isAuthCheckLoading && !!token;

  return {
    isAuthenticated: isAuthenticated,
    isLoading: appIsLoading,
    user
  };
}
