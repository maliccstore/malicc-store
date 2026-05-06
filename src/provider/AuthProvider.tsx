'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import {
  loadUserThunk,
  markHydrated,
} from '../store/slices/authSlice';

import { RootState, AppDispatch } from '@/store';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const { hydrated, loading, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const token = Cookies.get('auth-token');

    if (token && !user) {
      dispatch(loadUserThunk());
    } else {
      dispatch(markHydrated());
    }
  }, [dispatch, user]);

  if (!hydrated) {
    return <div>Initializing...</div>;
  }

  if (loading) {
    return <div>Checking auth...</div>;
  }

  return <>{children}</>;
}