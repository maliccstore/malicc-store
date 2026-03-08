// src/features/auth/hooks/useRazorpayCheckout.ts
import { useCallback, useState } from 'react';
import {
  createPaymentOrderAPI,
  verifyPaymentAPI,
} from '@/services/payment.service';

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
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
      const rzp = new (window as any).Razorpay({
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
          } catch (err: any) {
            options.onFailure(
              err.message || 'Verification error. Contact support.'
            );
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
    } catch (err: any) {
      setLoading(false);
      options.onFailure(err.message || 'Failed to initiate payment.');
    }
  }, []);

  return { initiateCheckout, loading };
};
