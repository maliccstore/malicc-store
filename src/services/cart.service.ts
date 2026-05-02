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
  },

  updateCartItem: async (productId: string, quantity: number) => {
    const query = `
      mutation UpdateCartItem($input: UpdateCartItemInput!) {
        updateCartItem(input: $input) {
          id
          items {
            productId
            quantity
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
          input: { productId, quantity }
        }
      });
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      return response.data.data.updateCartItem;
    } catch (error) {
      throw error;
    }
  },

  removeFromCart: async (productId: string) => {
    const query = `
      mutation RemoveFromCart($productId: String!) {
        removeFromCart(productId: $productId) {
          id
          items {
            productId
          }
          totalAmount
          totalItems
        }
      }
    `;

    try {
      const response = await apiClient.post("", {
        query,
        variables: { productId }
      });
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      return response.data.data.removeFromCart;
    } catch (error) {
      throw error;
    }
  },

  clearCart: async () => {
    const query = `
      mutation ClearCart {
        clearCart {
          id
          items {
            productId
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
      return response.data.data.clearCart;
    } catch (error) {
      throw error;
    }
  }
};
