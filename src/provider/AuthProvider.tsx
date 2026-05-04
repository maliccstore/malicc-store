'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { loadUserThunk } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
const { hydrated } = useSelector((state: RootState) => state.auth);
  const { user, loading } = useSelector((state: RootState) => state.auth);


 
useEffect(() => {
    const token = Cookies.get('auth-token');

    if (token && !user) {
      dispatch(loadUserThunk());
    }
  }, [dispatch, user]);

  // 🛑 Prevent render until auth check completes
  if (loading) {
    return <div>Checking auth...</div>; // or skeleton loader
  }
    if (!hydrated) {
  return <div>Initializing...</div>;
}
  return <>{children}</>;
}