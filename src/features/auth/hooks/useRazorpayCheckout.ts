// src/features/auth/hooks/useRazorpayCheckout.ts
import { useCallback, useState } from 'react';
import {
  createPaymentOrderAPI,
  verifyPaymentAPI,
} from '@/services/payment.service';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image: string;
  prefill: {
    name: string;
    contact: string;
    email: string;
  };
  theme: { color: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => Promise<void>;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

interface CheckoutOptions {
  orderId: string;
  couponCode?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  onSuccess: (orderId: string) => void;
  onFailure: (error: string) => void;
}

export const useRazorpayCheckout = () => {
  const [loading, setLoading] = useState(false);

  const initiateCheckout = useCallback(async (options: CheckoutOptions) => {
    setLoading(true);

    try {
      // Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        options.onFailure(
          'Failed to load payment gateway. Check your connection.'
        );
        setLoading(false);
        return;
      }

      // Step 1 — create Razorpay order on backend
      const orderData = await createPaymentOrderAPI(
        options.orderId,
        options.couponCode
      );

      setLoading(false); // stop loading before modal opens

      // Step 2 — open Razorpay modal
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: 'Malicc',
        description: 'Order Payment',
        image: '/assets/images/malicc.svg',
        prefill: {
          name: options.customerName,
          contact: options.customerPhone,
          email: options.customerEmail || '',
        },
        theme: { color: '#000000' },

        // Step 3 — verify signature after payment
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setLoading(true);
          try {
            const result = await verifyPaymentAPI({
              orderId: options.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (result.success) {
              options.onSuccess(options.orderId);
            } else {
              options.onFailure(
                'Payment verification failed. Contact support.'
              );
            }
          } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Verification error. Contact support.';
            options.onFailure(errorMessage);
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            options.onFailure('cancelled');
          },
        },
      });

      rzp.open();
    } catch (err: unknown) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate payment.';
      options.onFailure(errorMessage);
    }
  }, []);

  return { initiateCheckout, loading };
};
