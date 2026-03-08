"use client";
// src/app/(protected)/checkout/Payment/page.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRazorpayCheckout } from "@/features/auth/hooks/useRazorpayCheckout";
import { clearCheckoutState } from "@/store/slices/checkoutSlice";
import { Card, Heading, Text } from "@radix-ui/themes";
import { ShieldCheck, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { initiateCheckout, loading } = useRazorpayCheckout();

  // ── Redux state ───────────────────────────────────────────────
  const currentOrder   = useAppSelector((state) => state.orders.currentOrder);
  const user           = useAppSelector((state) => state.auth.user);
  const couponCode     = useAppSelector((state) => state.checkout.couponCode);
  const discountAmount = useAppSelector((state) => state.checkout.discountAmount);

  useEffect(() => {
    if (!currentOrder?.id) {
      router.replace("/checkout");
    }
  }, [currentOrder, router]);

  const handlePayment = async () => {
    if (!currentOrder?.id || !user) return;

    await initiateCheckout({
      orderId: currentOrder.id,
      couponCode: couponCode || undefined,
      customerName: user.username || "Customer",
      customerPhone: user.phoneNumber || "",
      customerEmail: user.email || "",

      onSuccess: (orderId) => {
        dispatch(clearCheckoutState());
        router.push(`/orders/confirmation?orderId=${orderId}`);
      },

      onFailure: (error) => {
        if (error === "cancelled") return;
        alert(`Payment failed: ${error}`);
      },
    });
  };

  if (!currentOrder) return null;

  const subtotal      = currentOrder.subtotal ?? currentOrder.totalAmount;
  const shippingFee   = currentOrder.shippingFee ?? 0;
  const finalAmount   = currentOrder.totalAmount - (discountAmount ?? 0);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Heading size="8" className="mb-8 font-bold tracking-tight">
        Payment
      </Heading>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">

        {/* Secure Payment Notice */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <Lock className="text-green-600" size={24} />
            <Heading size="4" className="font-semibold">Secure Payment</Heading>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
            <ShieldCheck size={20} className="text-green-600 shrink-0" />
            <Text size="2" className="text-gray-600 dark:text-gray-400">
              Your payment is encrypted and secured by Razorpay. We never store your card details.
            </Text>
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <CreditCard className="text-blue-600" size={24} />
            <Heading size="4" className="font-semibold">Order Summary</Heading>
          </div>

          <div className="space-y-3 mb-2">
            <div className="flex justify-between">
              <Text size="2" className="text-gray-600 dark:text-gray-400">Order ID</Text>
              <Text size="2" className="font-mono text-gray-500 dark:text-gray-500">
                {currentOrder.id.slice(0, 8)}...
              </Text>
            </div>

            <div className="flex justify-between">
              <Text size="2" className="text-gray-600 dark:text-gray-400">Subtotal</Text>
              <Text size="2">₹{subtotal?.toFixed(2)}</Text>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between">
                <Text size="2" className="text-green-600">
                  Discount {couponCode ? `(${couponCode})` : ""}
                </Text>
                <Text size="2" className="text-green-600">
                  −₹{discountAmount.toFixed(2)}
                </Text>
              </div>
            )}

            <div className="flex justify-between">
              <Text size="2" className="text-gray-600 dark:text-gray-400">Shipping</Text>
              <Text size="2" className={shippingFee === 0 ? "text-green-600" : ""}>
                {shippingFee === 0 ? "Free" : `₹${shippingFee.toFixed(2)}`}
              </Text>
            </div>

            <div className="flex justify-between">
              <Text size="2" className="text-gray-600 dark:text-gray-400">Tax</Text>
              <Text size="2">₹0.00</Text>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

            <div className="flex justify-between">
              <Text size="3" weight="bold">Total</Text>
              <Text size="3" weight="bold">₹{finalAmount.toFixed(2)}</Text>
            </div>
          </div>
        </Card>

        {/* Pay Button Card */}
        <Card className="p-6">
          <Button
            className="w-full text-lg py-6"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay ₹${finalAmount.toFixed(2)}`}
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4">
            <ShieldCheck size={14} className="text-gray-400" />
            <Text size="1" className="text-gray-400 dark:text-gray-500">
              Secured by Razorpay · UPI, Cards, Net Banking accepted
            </Text>
          </div>
        </Card>

      </div>
    </div>
  );
}