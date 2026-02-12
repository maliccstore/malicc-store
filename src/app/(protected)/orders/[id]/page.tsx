'use client';

import { useEffect, use } from 'react';
import { Heading, Text, Card, Badge, Separator, Box, Flex, Button } from '@radix-ui/themes';
import { Package, MapPin, AlertCircle, ChevronLeft, CreditCard, Truck, Calendar, Copy } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrderDetails, clearCurrentOrder } from '@/store/slices/orderSlice';
import toast from 'react-hot-toast';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const wrappedParams = use(params);
    const dispatch = useAppDispatch();
    const { currentOrder: order, loading, error } = useAppSelector((state) => state.orders);

    useEffect(() => {
        if (wrappedParams.id) {
            dispatch(fetchOrderDetails(wrappedParams.id));
        }
        return () => {
            dispatch(clearCurrentOrder());
        };
    }, [dispatch, wrappedParams.id]);

    if (loading) {
        return (
            <Flex
                align="center"
                justify="center"
                height="50vh"
            >
                <Flex direction="column" align="center" gap="2">
                    <Box
                        width="32px"
                        height="32px"
                        className="animate-spin rounded-full border-b-2 border-gray-900"
                    />
                    <Text color="gray">Loading order details...</Text>
                </Flex>
            </Flex>
        );
    }

    if (error || !order) {
        return (
            <Flex className="max-w-4xl mx-auto p-4 ">
                <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600">
                    <ChevronLeft size={16} />
                    Back to Orders
                </Link>
                <Flex className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    <Text>{error || 'Order not found'}</Text>
                </Flex>
            </Flex>
        );
    }

    return (
        <Box className="max-w-5xl mx-auto">
            <Link href="/orders" className="inline-flex items-center gap-2">
                <ChevronLeft size={16} />
                Back to Orders
            </Link>

            <Flex direction="column" gap="4">
                <Box className="flex-1 space-y-6">
                    {/* Items Card */}
                    <Card className="p-0 overflow-hidden border-0 shadow-sm ring-1 ring-gray-200">
                        <Flex justify="between" align="center" className="px-6 py-4 border-b border-gray-100">
                            <Heading size="4">Order Items</Heading>
                            <Badge color={getStatusColor(order.status)} size="1" variant="solid" radius="full" className="px-3">
                                {order.status}
                            </Badge>
                        </Flex>
                        <Box className="p-6">
                            <Flex direction="column" gap="6">
                                {order.items.map((item) => (
                                    <Flex key={item.id} direction={{ initial: 'column', sm: 'row' }} gap="4">
                                        <Flex align="center" justify="center" className="h-20 w-20 rounded-lg flex-shrink-0 self-center sm:self-start">
                                            <Package size={32} />
                                        </Flex>
                                        <Box className="flex-1 w-full">
                                            <Flex direction={{ initial: "column", sm: "row" }} justify="between" align={{ initial: "stretch", sm: "start" }} gap="2">
                                                <Box>
                                                    <Text weight="medium" className="block text-lg mb-1">{item.productName}</Text>
                                                    <Text size="2" color="gray" className="block break-all">Product ID: {item.productId}</Text>
                                                </Box>
                                                <Text weight="bold" size="4" className="self-end sm:self-auto">${item.totalPrice}</Text>
                                            </Flex>
                                            <Flex align="center" justify={{ initial: "between", sm: "start" }} gap={{ initial: "0", sm: "4" }}>
                                                <Flex gap="4">
                                                    <Text>Qty: {item.quantity}</Text>
                                                    <Text>×</Text>
                                                    <Text>${item.unitPrice}</Text>
                                                </Flex>
                                            </Flex>
                                        </Box>
                                    </Flex>
                                ))}
                            </Flex>
                        </Box>
                    </Card>
                </Box>

                <Flex direction="column" gap="4">
                    {/* Order Summary */}
                    <Card className="p-6 shadow-sm ring-1 ring-gray-200">
                        <Heading size="3">Order Summary</Heading>
                        <Flex direction="column" gap="3" className="text-sm">
                            <Flex justify="between">
                                <Text>Subtotal</Text>
                                <Text>${order.subtotal}</Text>
                            </Flex>
                            <Flex justify="between">
                                <Text>Shipping</Text>
                                <Text>${order.shippingFee}</Text>
                            </Flex>
                            <Flex justify="between">
                                <Text>Tax</Text>
                                <Text>${order.tax}</Text>
                            </Flex>
                            <Separator />
                            <Flex justify="between">
                                <Text>Total</Text>
                                <Text>${order.totalAmount}</Text>
                            </Flex>
                        </Flex>
                    </Card>

                    {/* Shipping Address */}
                    <Card className="p-6 shadow-sm ring-1 ring-gray-200">
                        <Flex align="center" gap="2" className="mb-4">
                            <MapPin size={20} />
                            <Heading size="3">Delivery Address</Heading>
                        </Flex>
                        {order.shippingAddress ? (
                            <Flex direction="column" gap="1" >
                                <Text weight="medium">{order.shippingAddress.fullName}</Text>
                                <Text>{order.shippingAddress.addressLine1}</Text>
                                {order.shippingAddress.addressLine2 && <Text>{order.shippingAddress.addressLine2}</Text>}
                                <Text>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</Text>
                                <Text>{order.shippingAddress.country}</Text>
                                <Text>{order.shippingAddress.phoneNumber}</Text>
                            </Flex>
                        ) : (
                            <Text size="2" color="gray">No shipping address provided</Text>
                        )}
                    </Card>

                    {/* Payment & Method */}
                    <Card className="p-6 shadow-sm ring-1 ring-gray-200">
                        <Heading size="3" className='mb-4'>Payment & Shipping</Heading>
                        <Flex direction="column" gap="4">
                            <Flex align="start" gap="3">
                                <CreditCard size={18} />
                                <Box>
                                    <Text weight="medium" size="2">Payment Method: </Text>
                                    <Text size="1" color="gray">{order.paymentMethod || 'N/A'}</Text>
                                </Box>
                            </Flex>
                            <Flex align="start" gap="3">
                                <Truck size={18} />
                                <Box>
                                    <Text weight="medium" size="2">Shipping Method: </Text>
                                    <Text size="1" color="gray">{order.shippingMethod || 'Standard Shipping'}</Text>
                                </Box>
                            </Flex>
                        </Flex>
                    </Card>

                    {/* Order Meta */}
                    <Card>
                        <Flex direction="column" gap="3" >
                            <Flex align="center" gap="2" >
                                <Calendar size={16} />
                                <Text>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}</Text>
                            </Flex>
                            <Flex align="center" gap="2" >
                                <Package size={16} />
                                <Text className="font-mono" size="1">Order #{order.id}</Text>
                                <Button size="1" variant="ghost" onClick={() => {
                                    navigator.clipboard.writeText(order.id);
                                    toast.success('Order ID copied');
                                }} className='cursor-pointer'>
                                    <Copy size={12} />
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>
                </Flex>
            </Flex>
        </Box>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'CREATED': return 'blue';
        case 'PROCESSING': return 'orange';
        case 'SHIPPED': return 'indigo';
        case 'DELIVERED': return 'green';
        case 'CANCELLED': return 'red';
        case 'FAILED': return 'red';
        default: return 'gray';
    }
}
