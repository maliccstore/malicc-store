import apiClient from "./apiClient";

export const cartAPI = {
  addToCart: async (productId: string, quantity: number = 1) => {
    const query = `
      mutation AddToCart($input: AddToCartInput!) {
        addToCart(input: $input) {
          id
          items {
            productId
            quantity
            price
            name
          }
          totalAmount
          totalItems
        }
      }
    `;

    try {
      const response = await apiClient.post("", {
        query,
        variables: {
          input: {
            productId,
            quantity
          }
        },
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.addToCart;
    } catch (error) {
      throw error;
    }
  },

  getCart: async () => {
    const query = `
      query GetCart {
        getCart {
          id
          items {
            productId
            quantity
            price
            name
            image
          }
          totalAmount
          totalItems
        }
      }
    `;

    try {
      const response = await apiClient.post("", { query });
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      return response.data.data.getCart;
    } catch (error) {
      throw error;
    }
  }
};
