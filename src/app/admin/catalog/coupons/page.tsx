'use client';

import { useEffect, useState } from 'react';
import {
    Button,
    Heading,
    Flex,
} from '@radix-ui/themes';
import Link from 'next/link';
import { PlusIcon } from '@radix-ui/react-icons';
import { adminCouponAPI } from '@/services/admin/coupon.admin';
import { AdminCoupon } from '@/features/admin/coupons/coupon.types';
import { CouponTable } from '@/components/admin/coupons/CouponTable';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const { data } = await adminCouponAPI.getAll();
            setCoupons(data);
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDisable = async (id: string) => {
        if (!window.confirm('Are you sure you want to disable this coupon?')) return;
        try {
            await adminCouponAPI.disable(id);
            fetchCoupons();
        } catch (error) {
            alert('Failed to disable coupon');
            console.error(error);
        }
    };

    return (
        <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
                <Heading size="6">Coupons</Heading>
                <Link href="/admin/catalog/coupons/new">
                    <Button>
                        <PlusIcon /> New Coupon
                    </Button>
                </Link>
            </Flex>

            <CouponTable
                coupons={coupons}
                loading={loading}
                onDisable={handleDisable}
            />
        </Flex>
    );
}
