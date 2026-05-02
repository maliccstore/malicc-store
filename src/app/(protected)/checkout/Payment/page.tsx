"use client";
// src/app/(protected)/checkout/Payment/page.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRazorpayCheckout } from "@/features/auth/hooks/useRazorpayCheckout";
import { clearCheckoutState } from "@/store/slices/checkoutSlice";
import { fetchOrderDetails } from "@/store/slices/orderSlice";
import { Card, Heading, Text, Callout } from "@radix-ui/themes";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  AlertCircle,
  Info,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/services/analytics/analytics.service";
import { getSessionId } from "@/services/analytics/session";
import { ANALYTICS_EVENTS } from "@/constants/event-constants";

type PaymentError = {
  type: "cancelled" | "failed" | "verification_error";
  message: string;
} | null;

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { initiateCheckout, loading } = useRazorpayCheckout();

  // ── Redux state ───────────────────────────────────────────────
  const currentOrder = useAppSelector((state) => state.orders.currentOrder);
  const ordersLoading = useAppSelector((state) => state.orders.loading);
  const user = useAppSelector((state) => state.auth.user);
  const couponCode = useAppSelector((state) => state.checkout.couponCode);
  const discountAmount = useAppSelector(
    (state) => state.checkout.discountAmount,
  );
  const originalSubtotal = useAppSelector(
    (state) => state.checkout.originalSubtotal,
  );

  // ── Local state ───────────────────────────────────────────────
  const [paymentError, setPaymentError] = useState<PaymentError>(null);

  useEffect(() => {
    if (!currentOrder?.id) {
      // Only redirect if we're not currently loading an order
      if (!ordersLoading) {
        router.replace("/checkout");
      }
    } else {
      // Refresh order details on mount to get latest status (if not already loading)
      if (!ordersLoading) {
        dispatch(fetchOrderDetails(currentOrder.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder?.id, router, dispatch]);

  // Set initial error if order is already failed
  useEffect(() => {
    if (currentOrder?.status === "FAILED" && !paymentError) {
      setPaymentError({
        type: "failed",
        message:
          "This order previously failed or was cancelled. You can retry the payment below.",
      });
    }
  }, [currentOrder?.status, paymentError]);

  const handlePayment = async () => {
    if (!currentOrder?.id || !user) return;

    setPaymentError(null); // Clear previous errors on retry

    // Track payment initiation/retry to update live order count
    trackEvent({
      event: ANALYTICS_EVENTS.CHECKOUT_STARTED,
      sessionId: getSessionId(),
      userId: user.id,
      metadata: {
        orderId: currentOrder.id,
        isRetry: !!paymentError,
      },
    });

    await initiateCheckout({
      orderId: currentOrder.id,
      customerName: user.username || "Customer",
      customerPhone: user.phoneNumber || "",
      customerEmail: user.email || "",

      onSuccess: (orderId) => {
        dispatch(clearCheckoutState());
        router.push(`/orders/confirmation?orderId=${orderId}`);
      },

      onFailure: (error) => {
        if (error === "cancelled") {
          setPaymentError({
            type: "cancelled",
            message: "Payment cancelled. You can try again when ready.",
          });
          return;
        }

        if (
          error.includes("verification failed") ||
          error.includes("Verification error")
        ) {
          setPaymentError({
            type: "verification_error",
            message:
              "Payment could not be verified. Please contact support with your Order ID.",
          });
          return;
        }

        setPaymentError({
          type: "failed",
          message:
            error ||
            "Payment failed. Please try again with a different method.",
        });
      },
    });
  };

  if (!currentOrder) return null;

  // Use persisted subtotal
  const subtotal = originalSubtotal ?? currentOrder.totalAmount;
  const shippingFee = currentOrder.shippingFee ?? 0;
  // finalAmount is already discounted in totalAmount from backend
  const finalAmount = currentOrder.totalAmount;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Heading size="8" className="mb-8 font-bold tracking-tight">
        Payment
      </Heading>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {/* Error Banners */}
        {paymentError && (
          <Callout.Root
            size="2"
            color={paymentError.type === "cancelled" ? "blue" : "red"}
            variant="surface"
            className="mb-2"
          >
            <Callout.Icon>
              {paymentError.type === "cancelled" ? (
                <Info size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </Callout.Icon>
            <Callout.Text className="font-medium">
              {paymentError.message}
            </Callout.Text>
          </Callout.Root>
        )}

        {/* Secure Payment Notice */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <Lock className="text-green-600" size={24} />
            <Heading size="4" className="font-semibold">
              Secure Payment
            </Heading>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
            <ShieldCheck size={20} className="text-green-600 shrink-0" />
            <Text size="2" className="text-gray-600 dark:text-gray-400">
              Your payment is encrypted and secured by Razorpay. We never store
              your card details.
            </Text>
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <CreditCard className="text-blue-600" size={24} />
            <Heading size="4" className="font-semibold">
              Order Summary
            </Heading>
          </div>

          <div className="space-y-3 mb-2">
            <div className="flex justify-between">
              <Text size="2" className="text-gray-600 dark:text-gray-400">
                Order ID
              </Text>
              <Text
                size="2"
                className="font-mono text-gray-500 dark:text-gray-500"
              >
                {currentOrder.id.slice(0, 8)}...
              </Text>
            </div>

            <div className="flex justify-between">
              <Text size="2" className="text-gray-600 dark:text-gray-400">
                Subtotal
              </Text>
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
              <Text size="2" className="text-gray-600 dark:text-gray-400">
                Shipping
              </Text>
              <Text
                size="2"
                className={shippingFee === 0 ? "text-green-600" : ""}
              >
                {shippingFee === 0 ? "Free" : `₹${shippingFee.toFixed(2)}`}
              </Text>
            </div>

            <div className="flex justify-between">
              <Text size="2" className="text-gray-600 dark:text-gray-400">
                Tax
              </Text>
              <Text size="2">₹0.00</Text>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

            <div className="flex justify-between">
              <Text size="3" weight="bold">
                Total
              </Text>
              <Text size="3" weight="bold">
                ₹{finalAmount.toFixed(2)}
              </Text>
            </div>
          </div>
        </Card>

        {/* Pay / Retry Button Card */}
        <Card className="p-6">
          <div className="space-y-3">
            <Button
              className="w-full text-lg flex items-center justify-center gap-2"
              onClick={handlePayment}
              disabled={loading}
              variant={paymentError ? undefined : undefined}
            >
              {loading ? (
                "Processing..."
              ) : paymentError ? (
                <>
                  <RefreshCw size={20} />
                  Retry Payment (₹{finalAmount.toFixed(2)})
                </>
              ) : (
                `Pay ₹${finalAmount.toFixed(2)}`
              )}
            </Button>

            {paymentError && (
              <Button
                variant="outline"
                className="w-full text-md flex items-center justify-center gap-2 bg-white dark:bg-transparent"
                onClick={() => router.push("/checkout")}
                disabled={loading}
              >
                <ArrowLeft size={18} />
                Go Back to Checkout
              </Button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-center">
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
