// src/services/payment.service.ts
import apiClient from './apiClient';

// ── Create Razorpay Order ─────────────────────────────────────────
export const createPaymentOrderAPI = async (
  orderId: string,
  couponCode?: string
) => {
  const response = await apiClient.post('', {
    query: `
      mutation CreatePaymentOrder($orderId: String!, $couponCode: String) {
        createPaymentOrder(orderId: $orderId, couponCode: $couponCode) {
          razorpayOrderId
          amount
          currency
          keyId
        }
      }
    `,
    variables: { orderId, couponCode },
  });

  const result = response.data?.data?.createPaymentOrder;
  if (!result) throw new Error('Failed to create payment order');
  return result;
};

// ── Verify Payment ────────────────────────────────────────────────
export const verifyPaymentAPI = async (params: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => {
  const response = await apiClient.post('', {
    query: `
      mutation VerifyPayment(
        $orderId: String!
        $razorpayOrderId: String!
        $razorpayPaymentId: String!
        $razorpaySignature: String!
      ) {
        verifyPayment(
          orderId: $orderId
          razorpayOrderId: $razorpayOrderId
          razorpayPaymentId: $razorpayPaymentId
          razorpaySignature: $razorpaySignature
        ) {
          success
          orderId
          message
        }
      }
    `,
    variables: params,
  });

  const result = response.data?.data?.verifyPayment;
  if (!result) throw new Error('Failed to verify payment');
  return result;
};
