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

  getOrder: async (id: string) => {
    const query = `
      query Order($id: String!) {
        order(id: $id) {
          success
          message
          order {
            id
            status
            subtotal
            tax
            shippingFee
            totalAmount
            currency
            paymentMethod
            shippingMethod
            createdAt
            updatedAt
            items {
              id
              productName
              productId
              quantity
              unitPrice
              totalPrice
            }
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
          }
        }
      }
    `;

    try {
      const response = await apiClient.post("", {
        query,
        variables: { id },
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.order;
    } catch (error) {
      throw error;
    }
  },
};
