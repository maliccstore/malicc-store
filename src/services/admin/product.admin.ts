import apiClient from '@/services/apiClient';
import { AdminProduct } from '@/features/admin/products/product.types';

// Helper to map backend response to frontend types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapProductFromGQL = (p: any): AdminProduct => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  status: p.isActive ? 'ACTIVE' : 'INACTIVE',
  category: p.category,
  sku: p.sku,
  images: p.imageUrl || [],
  inventory: p.inventory ? {
    quantity: p.inventory.quantity,
    availableQuantity: p.inventory.availableQuantity
  } : {
    quantity: 0,
    availableQuantity: 0
  },
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

export const adminProductAPI = {
  getAll: async () => {
    const query = `
      query GetAllProducts {
        products {
          products {
            id
            name
            description
            price
            category
            imageUrl
            isActive
            sku
            createdAt
            updatedAt
            inventory {
              quantity
              availableQuantity
            }
          }
        }
      }
    `;
    const response = await apiClient.post('', { query });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return { data: response.data.data.products.products.map(mapProductFromGQL) };
  },

  getById: async (id: string) => {
    const query = `
      query GetProduct($id: String!) {
        product(id: $id) {
          product {
            id
            name
            description
            price
            category
            imageUrl
            isActive
            sku
            createdAt
            updatedAt
            inventory {
              quantity
              availableQuantity
            }
          }
        }
      }
    `;
    const response = await apiClient.post('', { query, variables: { id } });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return { data: mapProductFromGQL(response.data.data.product.product) };
  },

  create: async (data: Partial<AdminProduct>) => {
    const query = `
      mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
          success
          message
          product {
            id
            name
            description
            price
            category
            imageUrl
            isActive
            sku
            createdAt
            updatedAt
            inventory {
              quantity
              availableQuantity
            }
          }
        }
      }
    `;

    const input = {
      name: data.name,
      description: data.description || '',
      price: data.price,
      category: data.category,
      imageUrl: data.images || [],
      isActive: data.status === 'ACTIVE',
      sku: data.sku,
    };

    const response = await apiClient.post('', { query, variables: { input } });
    if (response.data.errors) throw new Error(response.data.errors[0].message);

    const resData = response.data.data.createProduct;
    if (!resData.success) throw new Error(resData.message);

    const createdProduct = resData.product;

    if (data.inventory?.quantity && data.inventory.quantity > 0) {
      try {
        const inventoryQuery = `
          mutation UpdateInventory($productId: String!, $quantity: Int!) {
            updateInventory(productId: $productId, quantity: $quantity) {
              id
              quantity
              availableQuantity
            }
          }
        `;

        // Ensure quantity is an integer
        const quantityInt = Math.floor(data.inventory.quantity);

        const invResponse = await apiClient.post('', {
          query: inventoryQuery,
          variables: {
            productId: createdProduct.id,
            quantity: quantityInt
          }
        });

        if (invResponse.data.errors) {
          console.error('Failed to update initial inventory:', invResponse.data.errors);
        } else {
          const invData = invResponse.data.data.updateInventory;
          if (invData) {
            createdProduct.inventory = {
              quantity: invData.quantity,
              availableQuantity: invData.availableQuantity
            };
          }
        }
      } catch (error) {
        console.error('Failed to update initial inventory:', error);
      }
    }

    return { data: mapProductFromGQL(createdProduct) };
  },

  update: async (id: string, data: Partial<AdminProduct>) => {
    const query = `
      mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
        updateProduct(id: $id, input: $input) {
          success
          message
          product {
            id
            name
            description
            price
            category
            imageUrl
            isActive
            sku
            createdAt
            updatedAt
            inventory {
              quantity
              availableQuantity
            }
          }
        }
      }
    `;

    const input = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.images,
      isActive: data.status ? data.status === 'ACTIVE' : undefined,
      sku: data.sku,
    };

    const response = await apiClient.post('', { query, variables: { id, input } });
    if (response.data.errors) throw new Error(response.data.errors[0].message);

    const resData = response.data.data.updateProduct;
    if (!resData.success) throw new Error(resData.message);

    const updatedProduct = resData.product;

    if (data.inventory?.quantity !== undefined) {
      try {
        const inventoryQuery = `
          mutation UpdateInventory($productId: String!, $quantity: Int!) {
            updateInventory(productId: $productId, quantity: $quantity) {
              id
              quantity
              availableQuantity
            }
          }
        `;

        // Ensure quantity is an integer
        const quantityInt = Math.floor(data.inventory.quantity);

        const invResponse = await apiClient.post('', {
          query: inventoryQuery,
          variables: {
            productId: updatedProduct.id,
            quantity: quantityInt
          }
        });

        if (invResponse.data.errors) {
          console.error('Failed to update inventory:', invResponse.data.errors);
        } else {
          const invData = invResponse.data.data.updateInventory;
          if (invData) {
            updatedProduct.inventory = {
              quantity: invData.quantity,
              availableQuantity: invData.availableQuantity
            };
          }
        }
      } catch (error) {
        console.error('Failed to update inventory:', error);
      }
    }

    return { data: mapProductFromGQL(updatedProduct) };
  },

  disable: async (id: string) => {
    const query = `
      mutation ToggleStatus($id: String!) {
        toggleProductStatus(id: $id) {
          product {
            isActive
          }
        }
      }
    `;
    const response = await apiClient.post('', { query, variables: { id } });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return { data: response.data.data.toggleProductStatus };
  },

  delete: async (id: string) => {
    const query = `
      mutation DeleteProduct($id: String!) {
        deleteProduct(id: $id) {
          success
          message
        }
      }
    `;
    const response = await apiClient.post('', { query, variables: { id } });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    const resData = response.data.data.deleteProduct;
    if (!resData.success) throw new Error(resData.message);
    return { data: resData };
  },
};
