'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addressAPI } from '@/services/address.service';
import { orderAPI } from '@/services/orderAPI';
import { Address } from '@/types/address';
import { setSelectedAddressId } from '@/store/slices/checkoutSlice';
import { clearCart } from '@/store/slices/cartSlice';
import { AddressSelection } from '@/components/checkout/AddressSelection';
import toast from 'react-hot-toast';
import { Card, Heading, Text, Badge } from '@radix-ui/themes';
import { MapPin, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { fetchOrderDetails } from '@/store/slices/orderSlice';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalAmount = useAppSelector((state) => state.cart.totalAmount);
  const { selectedAddressId, couponCode, discountAmount } = useAppSelector((state) => state.checkout);

  const safeTotal = totalAmount ?? 0;
  const safeDiscount = discountAmount ?? 0;
  const finalTotal = safeTotal - safeDiscount;

  // State
  const [loading, setLoading] = useState(true);
  const [deployingOrder, setDeployingOrder] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const hasFetched = useRef(false);

  const selectedAddress = useMemo(() =>
    addresses.find(addr => addr.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const fetchedAddresses = await addressAPI.getUserAddresses();
        setAddresses(fetchedAddresses);

        if (fetchedAddresses.length === 0) {
          toast.error("Please add a delivery address to continue");
          router.push('/address?redirect=checkout');
          return;
        }

        // Check for newAddress in URL
        const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const newAddressId = searchParams?.get('newAddress');

        if (newAddressId && fetchedAddresses.find(a => a.id === newAddressId)) {
          dispatch(setSelectedAddressId(newAddressId));
          // Clear query param without refresh
          window.history.replaceState({}, '', '/checkout');
        } else if (!selectedAddressId || !fetchedAddresses.find(a => a.id === selectedAddressId)) {
          // Auto-select logic
          const defaultAddr = fetchedAddresses.find(addr => addr.isDefault) || fetchedAddresses[0];
          dispatch(setSelectedAddressId(defaultAddr.id));
        }

      } catch (error) {
        console.error("Failed to fetch addresses", error);
        toast.error("Could not load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [dispatch, router, selectedAddressId]); // selectedAddressId added to satisfy eslint, hasFetched ref prevents re-run

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      setIsSelectingAddress(true);
      return;
    }

    try {
      setDeployingOrder(true);
      const response = await orderAPI.checkout(Number(selectedAddressId), "Prepaid", couponCode || undefined);

      if (response.success) {
        await dispatch(fetchOrderDetails(response.order.id));
        dispatch(clearCart());
        router.push('/checkout/Payment'); 
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

          {/* Address Step */}
          <Card className="p-6">
            {!isSelectingAddress ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-600" size={24} />
                    <Heading size="4">Delivery Address</Heading>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => setIsSelectingAddress(true)}
                  >
                    Change
                  </Button>
                </div>

                {selectedAddress && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Text weight="bold" size="3">{selectedAddress.fullName}</Text>
                      {selectedAddress.isDefault && <Badge color="green">Default</Badge>}
                    </div>
                    <Text as="p" size="2" className="text-gray-600">
                      {selectedAddress.addressLine1}, {selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ', ' : ''}
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
                    </Text>
                    <Text as="p" size="2" className="text-gray-600 mt-1">
                      Phone: {selectedAddress.phoneNumber}
                    </Text>
                  </div>
                )}
              </div>
            ) : (
              <AddressSelection
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelect={(id) => dispatch(setSelectedAddressId(id))}
                onConfirm={() => setIsSelectingAddress(false)}
              />
            )}
          </Card>

          {/* Payment Method Section (Fixed to Prepaid) */}
          {!isSelectingAddress && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                <CreditCard className="text-green-600" size={24} />
                <Heading size="4" className="font-semibold">Payment Method</Heading>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="font-medium text-gray-900">Prepaid</span>
              </div>
            </Card>
          )}

          {/* Order Items Review */}
          {!isSelectingAddress && (
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
          )}
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8">
            <Heading size="4" className="font-semibold mb-6">Order Summary</Heading>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${safeTotal.toFixed(2)}</span>
              </div>
              {safeDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {couponCode ? `(${couponCode})` : ''}</span>
                  <span>-${safeDiscount.toFixed(2)}</span>
                </div>
              )}
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
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full text-lg py-6"
              onClick={handlePlaceOrder}
              disabled={deployingOrder || isSelectingAddress || !selectedAddressId}
            >
              {deployingOrder ? 'Processing...' : 'Proceed to Payment'}
            </Button>

            {isSelectingAddress && (
              <Text size="1" color="gray" className="mt-3 block text-center">
                Confirm your address selection to proceed
              </Text>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
