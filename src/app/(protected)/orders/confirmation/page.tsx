'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrderDetails } from '@/store/slices/orderSlice';
import { Card, Heading, Text, Badge } from '@radix-ui/themes';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const orderId = searchParams.get('orderId');

  const { currentOrder, loading } = useAppSelector((state) => state.orders);
  const user = useAppSelector((state) => state.auth.user);

  const [initialLoading, setInitialLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!orderId) {
      router.replace('/orders');
      return;
    }

    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchOrderDetails(orderId))
        .unwrap()
        .then(() => setInitialLoading(false))
        .catch(() => {
          setInitialLoading(false);
          router.replace('/orders');
        });
    }
  }, [orderId, dispatch, router]);

  if (initialLoading || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Text size="3" className="text-gray-500 dark:text-gray-400">Loading order details...</Text>
      </div>
    );
  }

  if (!currentOrder) {
    return null; // Will redirect via useEffect catch
  }

  return (
    <div className="max-w-4xl mx-auto p-4">

      {/* Success Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
          <CheckCircle className="text-green-600 dark:text-green-500" size={40} />
        </div>
        <Heading size="8" className="font-bold tracking-tight mb-3">
          Order Placed Successfully!
        </Heading>
        <Text size="3" className="text-gray-600 dark:text-gray-400">
          Thank you for your purchase, {user?.username || 'Customer'}. We've received your order.
        </Text>
      </div>

      <div className="grid gap-6">

        {/* Main Details */}
        <div className="space-y-6">

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <Package className="text-blue-600" size={24} />
                <Heading size="4" className="font-semibold">Order Details</Heading>
              </div>
              <Badge color={currentOrder.status === 'PAID' ? 'green' : 'blue'}>
                {currentOrder.status || 'PROCESSING'}
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text size="2" className="text-gray-500 block mb-1">Order ID</Text>
                  <Text size="2" className="font-mono font-medium">{currentOrder.id}</Text>
                </div>
                <div>
                  <Text size="2" className="text-gray-500 block mb-1">Date Placed</Text>
                  <Text size="2" className="font-medium">
                    {new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </Text>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Heading size="3" className="font-medium mb-2">Items Purchased</Heading>
              {currentOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div className="flex flex-col">
                    <Text weight="medium">{item.productName}</Text>
                    <Text size="1" color="gray">Qty: {item.quantity}</Text>
                  </div>
                  <Text weight="medium">₹{item.totalPrice.toFixed(2)}</Text>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <MapPin className="text-orange-600" size={24} />
              <Heading size="4" className="font-semibold">Shipping details</Heading>
            </div>
            {currentOrder.shippingAddress && (
              <div className="space-y-1">
                <Text weight="medium" className="block">
                  {currentOrder.shippingAddress.fullName}
                </Text>
                <Text size="2" className="block">
                  {currentOrder.shippingAddress.addressLine1}
                  {currentOrder.shippingAddress.addressLine2 && `, ${currentOrder.shippingAddress.addressLine2}`}
                </Text>
                <Text size="2" className="block">
                  {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.postalCode}
                </Text>
                <Text size="2" className="block mt-2">
                  Phone: {currentOrder.shippingAddress.phoneNumber}
                </Text>
              </div>
            )}
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <Card className="p-6">
            <Heading size="4" className="font-semibold mb-4">Payment Summary</Heading>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <Text size="2">Subtotal</Text>
                <Text size="2">₹{(currentOrder.subtotal ?? currentOrder.totalAmount).toFixed(2)}</Text>
              </div>

              {/* Note: if there is a discount, it might be derived from subtotal vs totalAmount depending on API.
                   assuming totalAmount is final */}
              {currentOrder.subtotal && currentOrder.totalAmount < currentOrder.subtotal && (
                <div className="flex justify-between text-green-600">
                  <Text size="2">Discount</Text>
                  <Text size="2">−₹{(currentOrder.subtotal - currentOrder.totalAmount).toFixed(2)}</Text>
                </div>
              )}

              <div className="flex justify-between">
                <Text size="2">Shipping</Text>
                <Text size="2" className={(currentOrder.shippingFee === 0 || !currentOrder.shippingFee) ? "text-green-600" : ""}>
                  {(currentOrder.shippingFee === 0 || !currentOrder.shippingFee) ? "Free" : `₹${currentOrder.shippingFee.toFixed(2)}`}
                </Text>
              </div>

              <div className="h-px bg-gray-200 my-2" />

              <div className="flex justify-between font-bold text-lg">
                <Text size="3" weight="bold">Total Paid</Text>
                <Text size="3" weight="bold">₹{currentOrder.totalAmount.toFixed(2)}</Text>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-gray-500 bg-white p-3 rounded-md border border-gray-100">
              <Truck size={18} />
              {/* TODO: Add estimated delivery date */}
              <Text size="1">Standard shipping. Estimated delivery: 3-5 business days.</Text>
            </div>
          </Card>

          <div className="space-y-3">
            <Link href="/explore" className="block">
              <Button className="w-full text-md">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/orders" className="block">
              <Button variant="outline" className="w-full text-md">
                View My Orders
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
