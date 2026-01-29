import apiClient from "./apiClient";

export const orderAPI = {
  checkout: async (addressId: number, paymentMethod: string = "COD") => {
    const query = `
      mutation Checkout($addressId: Float!, $paymentMethod: String) {
        checkout(addressId: $addressId, paymentMethod: $paymentMethod) {
          success
          message
          order {
            id
            totalAmount
            status
          }
        }
      }
    `;

    try {
      const response = await apiClient.post("", {
        query,
        variables: { addressId, paymentMethod },
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.checkout;
    } catch (error) {
      throw error;
    }
  },

  myOrders: async () => {
    const query = `
      query MyOrders {
        myOrders {
          success
          message
          orders {
            id
            status
            totalAmount
            createdAt
            items {
              id
              productName
              quantity
              unitPrice
              totalPrice
            }
            shippingAddress {
              addressLine1
              city
              state
            }
          }
        }
      }
    `;

    try {
      const response = await apiClient.post("", { query });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.myOrders;
    } catch (error) {
      throw error;
    }
  },
};
