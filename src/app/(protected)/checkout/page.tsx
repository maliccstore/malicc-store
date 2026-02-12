'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAppSelector } from '@/store/hooks';
import { addressAPI } from '@/services/address.service';
import { orderAPI } from '@/services/orderAPI';
import { Address } from '@/types/address';
import toast from 'react-hot-toast';
import { Card, Heading, Text, Badge } from '@radix-ui/themes';
import { MapPin, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalAmount = useAppSelector((state) => state.cart.totalAmount);

  // State
  const [loading, setLoading] = useState(true);
  const [deployingOrder, setDeployingOrder] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const addresses = await addressAPI.getUserAddresses();

        // Find default address
        const def = addresses.find(addr => addr.isDefault) || addresses[0] || null;
        setDefaultAddress(def);

      } catch (error) {
        console.error("Failed to fetch addresses", error);
        toast.error("Could not load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handlePlaceOrder = async () => {
    if (!defaultAddress) {
      toast.error("Please add a delivery address first");
      return;
    }

    try {
      setDeployingOrder(true);
      const response = await orderAPI.checkout(Number(defaultAddress.id), "COD");

      if (response.success) {
        toast.success("Order placed successfully!");
        router.push('/orders'); // Redirect to orders page
      } else {
        toast.error(response.message || "Failed to place order");
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      const message = error instanceof Error ? error.message : "Something went wrong processing your order";
      toast.error(message);
    } finally {
      setDeployingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Text size="3" className="text-gray-500">Loading checkout details...</Text>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <Heading size="6" className="mb-4">Your cart is empty</Heading>
        <Link href="/explore">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Heading size="8" className="mb-8 font-bold  tracking-tight">Checkout</Heading>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">

        {/* Details Section */}
        <div className="space-y-6">

          {/* Delivery Address Section */}
          <Card className="p-6 overflow-hidden">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <MapPin className="text-blue-600" size={24} />
              <Heading size="4" className="font-semibold">Delivery Address</Heading>
            </div>

            {defaultAddress ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Text weight="bold" size="3">{defaultAddress.fullName}</Text>
                  {defaultAddress.isDefault && <Badge color="green">Default</Badge>}
                </div>
                <Text as="p" size="2" className="text-gray-600 block">
                  {defaultAddress.addressLine1}, {defaultAddress.addressLine2 ? defaultAddress.addressLine2 + ', ' : ''}
                </Text>
                <Text as="p" size="2" className="text-gray-600 block">
                  {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postalCode}
                </Text>
                <Text as="p" size="2" className="text-gray-600 block mt-1">
                  Phone: {defaultAddress.phoneNumber}
                </Text>
              </div>
            ) : (
              <div className="text-center py-6">
                <Text color="gray" className="mb-4 block">No delivery address found.</Text>
                <Link href="/address/new">
                  <Button className="bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50">Add New Address</Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Payment Method Section (Fixed to COD) */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <CreditCard className="text-green-600" size={24} />
              <Heading size="4" className="font-semibold">Payment Method</Heading>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
            </div>
          </Card>

          {/* Order Items Review */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <Truck className="text-orange-600" size={24} />
              <Heading size="4" className="font-semibold">Order Items ({cartItems.length})</Heading>
            </div>
            <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div className="flex gap-4">
                      {/* Ideally show image here too */}
                      <div className="space-y-1">
                        <Text weight="medium" className="block">{item.name}</Text>
                        <Text size="1" color="gray">Qty: {item.quantity}</Text>
                      </div>
                    </div>
                    <Text weight="medium">${(item.price * item.quantity).toFixed(2)}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>

        </div>

        {/* Order Summary Section */}
        <div className="">
          <Card className="p-6">
            <Heading size="4" className="font-semibold mb-6">Order Summary</Heading>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full text-lg py-6"
              onClick={handlePlaceOrder}
              disabled={deployingOrder || !defaultAddress}
            >
              {deployingOrder ? 'Processing...' : 'Proceed to Payment'}
            </Button>

            {!defaultAddress && (
              <Text size="1" color="red" className="mt-2 block text-center">
                Please add an address to continue
              </Text>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
