'use client';

import { useEffect, useState } from 'react';
import { orderAPI } from '@/services/orderAPI';
import { Heading, Text, Card, Badge, Button } from '@radix-ui/themes';
import { Package, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

interface Order {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string | number;
    items: OrderItem[];
    shippingAddress?: {
        addressLine1: string;
        city: string;
        state: string;
    };
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderAPI.myOrders();
                if (response.success) {
                    setOrders(response.orders);
                } else {
                    setError(response.message || 'Failed to load orders');
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <Text color="gray">Loading orders...</Text>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    <Text>{error}</Text>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex items-center gap-3 mb-8">
                <Package size={32} className="text-gray-900" />
                <Heading size="8" className="font-bold tracking-tight">My Orders</Heading>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <Heading size="4" className="mb-2 text-gray-900">No orders yet</Heading>
                    <Text className="text-gray-500 mb-6 block">Looks like you haven&apos;t placed any orders yet.</Text>
                    <Link href="/explore">
                        <Button size="3" variant="solid" className="cursor-pointer">Start Shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id} className="p-0 overflow-hidden border-0 shadow-sm ring-1 ring-gray-200">
                            {/* Header */}
                            <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase font-medium text-gray-500">Order Placed</span>
                                        <span className="font-medium text-gray-900">{new Date(Number(order.createdAt)).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase font-medium text-gray-500">Total</span>
                                        <span className="font-medium text-gray-900">${order.totalAmount}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase font-medium text-gray-500">Order #</span>
                                        <span className="font-mono text-gray-900">{order.id}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge color={getStatusColor(order.status)} size="1" variant="solid" radius="full" className="px-3">
                                        {order.status}
                                    </Badge>
                                    {/* Placeholder for details link */}
                                    <Link href={`/orders/${order.id}`}>
                                        <Button variant="ghost" size="1" className="text-blue-600 hover:text-blue-700 font-medium">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <div className="flex flex-col gap-6">
                                    {/* Items */}
                                    <div className="space-y-4">
                                        {order.items.map((item: OrderItem) => (
                                            <div key={item.id} className="flex items-start justify-between">
                                                <div className="flex gap-4">
                                                    <div className="h-16 w-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                                                        <Package size={24} className="text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <Text weight="medium" className="block text-gray-900">{item.productName}</Text>
                                                        <Text size="2" color="gray">Qty: {item.quantity}</Text>
                                                    </div>
                                                </div>
                                                <Text weight="medium">${item.totalPrice}</Text>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Address Preview */}
                                    {order.shippingAddress && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2 text-sm text-gray-500">
                                            <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                            <span>
                                                Delivery to {order.shippingAddress.city}, {order.shippingAddress.state}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'CREATED': return 'blue';
        case 'PROCESSING': return 'orange';
        case 'SHIPPED': return 'indigo';
        case 'DELIVERED': return 'green';
        case 'CANCELLED': return 'red';
        default: return 'gray';
    }
}
