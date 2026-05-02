import apiClient from "../apiClient";

export const ORDER_STATUS = {
  CREATED: 'CREATED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAID: 'PAID',
  FULFILLED: 'FULFILLED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED'
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const FULFILLMENT_STATUS = {
  UNFULFILLED: "UNFULFILLED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  RETURNED: "RETURNED",
} as const;

export type FulfillmentStatus = typeof FULFILLMENT_STATUS[keyof typeof FULFILLMENT_STATUS];

export interface OrderFilterInput {
  status?: OrderStatus;
  userId?: number;
  limit?: number;
  offset?: number;
}

export const getAllOrders = async (filters?: OrderFilterInput) => {
  const query = `
    query AdminOrders($filters: OrderFilterInput) {
      adminOrders(filters: $filters) {
        success
        message
        totalCount
        orders {
          id
          status
          fulfillmentStatus
          totalAmount
          currency
          createdAt
          shippingAddress {
             fullName
          }
          items {
            id
            productName
            quantity
          }
        }
      }
    }
  `;
  const response = await apiClient.post('', { query, variables: { filters } });
  return response.data.data.adminOrders;
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const mutation = `
        mutation UpdateOrderStatus($id: String!, $status: OrderStatus!) {
            updateOrderStatus(id: $id, status: $status) {
                success
                message
                order {
                    id
                    status
                }
            }
        }
    `;
  const response = await apiClient.post('', { query: mutation, variables: { id, status } });
  return response.data.data.updateOrderStatus;
};

export const updateFulfillmentStatus = async (id: string, status: FulfillmentStatus) => {
  const mutation = `
        mutation UpdateFulfillmentStatus($id: String!, $status: FulfillmentStatus!) {
            updateFulfillmentStatus(id: $id, status: $status) {
                success
                message
                order {
                    id
                    status
                    fulfillmentStatus
                }
            }
        }
    `;
  const response = await apiClient.post('', { query: mutation, variables: { id, status } });
  return response.data.data.updateFulfillmentStatus;
};

export const getOrderDetails = async (id: string) => {
  const query = `
    query Order($id: String!) {
      order(id: $id) {
        success
        message
        order {
          id
          status
          fulfillmentStatus
          subtotal
          tax
          shippingFee
          totalAmount
          currency
          discountAmount
          coupon {
            code
          }
          paymentMethod
          shippingMethod
          createdAt
          updatedAt
          shippingAddress {
            fullName
            phoneNumber
            addressLine1
            addressLine2
            city
            state
            postalCode
            country
          }
          items {
            id
            productId
            productName
            unitPrice
            quantity
            totalPrice
          }
        }
      }
    }
  `;
  const response = await apiClient.post('', { query, variables: { id } });
  return response.data.data.order;
}
