'use client';

import { useEffect } from 'react';
import { Heading, Text, Card, Badge, Button, Box, Flex } from '@radix-ui/themes';
import { Package, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyOrders } from '@/store/slices/orderSlice';

export default function OrdersPage() {
    const dispatch = useAppDispatch();
    const { orders, loading, error } = useAppSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    if (loading) {
        return (
            <Flex align="center" justify="center" className="h-[50vh]">
                <Flex direction="column" align="center" gap="2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <Text color="gray">Loading orders...</Text>
                </Flex>
            </Flex>
        );
    }

    if (error) {
        return (
            <Box className="max-w-5xl mx-auto p-4">
                <Flex className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg items-center gap-2">
                    <AlertCircle size={20} />
                    <Text>{error}</Text>
                </Flex>
            </Box>
        )
    }

    return (
        <Box className="max-w-5xl mx-auto">
            <Flex align="center" gap="3" className="mb-8">
                <Package size={32} />
                <Heading size="8" className="font-bold tracking-tight">My Orders</Heading>
            </Flex>

            {orders.length === 0 ? (
                <Flex direction="column" align="center" className="py-16 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                    <Box className="mb-4 text-gray-400">
                        <Package size={48} />
                    </Box>
                    <Heading size="4" className="mb-2 text-gray-900">No orders yet</Heading>
                    <Text className="text-gray-500 mb-6 block">Looks like you haven&apos;t placed any orders yet.</Text>
                    <Link href="/explore">
                        <Button size="3" variant="solid" className="cursor-pointer">Start Shopping</Button>
                    </Link>
                </Flex>
            ) : (
                <Flex direction="column" gap="4">
                    {orders.map((order) => (
                        <Link key={order.id} href={`/orders/${order.id}`} className="block">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer shadow-sm p-0 overflow-hidden">
                                <Flex direction={{ initial: 'column', sm: 'row' }} justify="between" gap="4" className="p-2 sm:p-4">
                                    <Flex direction="column" gap="1" className="w-full sm:w-auto">
                                        <Text size="2">Order <Text color="gray">#{order.id.slice(0, 9)}...</Text></Text>
                                        <Flex gap={{ initial: '4', sm: '1' }} direction={{ initial: 'row', sm: 'column' }}>
                                            <Text size="2" color="gray">Items: <Text weight="bold">{order.items.length}</Text></Text>
                                            <Text size="2" color="gray">Total: <Text weight="bold">${order.totalAmount}</Text></Text>
                                        </Flex>
                                    </Flex>

                                    <Flex direction={{ initial: 'row', sm: 'column' }} justify="between" align={{ initial: 'center', sm: 'end' }} gap={{ initial: '2', sm: '4' }} className="w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                        <Badge color={getStatusColor(order.status)} size="1" variant="solid" radius="full">
                                            {order.status}
                                        </Badge>
                                        <Text size="2" color="gray" className="text-right">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: '2-digit'
                                            })}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Link>
                    ))}
                </Flex>
            )}
        </Box>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'CREATED': return 'gray';
        case 'PAYMENT_PENDING': return 'orange';
        case 'PAID': return 'blue';
        case 'FULFILLED': return 'green';
        case 'CANCELLED': return 'red';
        case 'FAILED': return 'red';
        default: return 'gray';
    }
}
