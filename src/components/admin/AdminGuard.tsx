'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { loadUserThunk } from '@/store/slices/authSlice';
import { Flex, Text } from '@radix-ui/themes';

interface AdminGuardProps {
    children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const { user, isAuthenticated, loading, token } = useAppSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Recovery: If we have a token but aren't loading or authenticated, force a check
        if (!loading && token && !isAuthenticated) {
            dispatch(loadUserThunk());
        }
    }, [loading, token, isAuthenticated, mounted, dispatch]);

    useEffect(() => {
        if (!mounted) return;

        // Validation pending? Wait.
        if (loading || (token && !isAuthenticated)) {
            return;
        }

        // redirect logic...

        if (!loading) {
            if (!isAuthenticated) {
                router.push('/auth/login');
            } else if (!user?.isAdmin) {
                router.push('/');
            }
        }
    }, [isAuthenticated, loading, user, router, token, mounted]);

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) return null;

    // Show loading if:
    // 1. Redux is loading (verify/load in progress)
    // 2. We have a token but aren't authenticated yet (hydration in progress)
    if (loading || (token && !isAuthenticated)) {
        return (
            <Flex justify="center" align="center" style={{ height: '100vh', width: '100%' }}>
                <Text>Loading Admin Panel...</Text>
            </Flex>
        );
    }

    // If check failed (and effect hasn't redirected yet), don't render children
    if (!isAuthenticated || !user?.isAdmin) {
        return null;
    }

    return <>{children}</>;
}
