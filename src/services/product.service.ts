import apiClient from './apiClient';
import { Product, ProductFilterInput } from '@/types/product';
import axios from 'axios';

export const productService = {
    fetchProducts: async (filters?: ProductFilterInput): Promise<Product[]> => {
        try {
            const query = `
        query GetProducts($filters: ProductFilterInput) {
          products(filters: $filters) {
            success
            message
            products {
              id
              name
              description
              price
              category
              imageUrl
              inventory {
                isInStock
              }
              isActive
              createdAt
            }
          }
        }
      `;

            // Authorization header is handled by apiClient interceptor
            const response = await apiClient.post('', {
                query,
                variables: { filters },
            }, {
                timeout: 10000,
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            const { data } = response.data;
            if (!data.products.success) {
                throw new Error(data.products.message || 'Failed to fetch products');
            }

            interface ProductResponseItem {
                id: string;
                name: string;
                description: string;
                imageUrl: string[];
                price: number;
                category: string;
                inventory?: {
                    isInStock: boolean;
                };
                isActive: boolean;
                createdAt: string;
            }

            return data.products.products.map((item: ProductResponseItem) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                image: item.imageUrl && item.imageUrl.length > 0 ? item.imageUrl[0] : '', // Use first image or empty string
                price: item.price,
                rating: '4', // Default rating as backend doesn't provide it yet [TODO]
                category: item.category,
                inStock: item.inventory?.isInStock ?? item.isActive, // Fallback to isActive if inventory is missing
                createdAt: item.createdAt,
            }));
        } catch (error) {
            console.error('Error inside fetchProducts:', error);

            if (axios.isAxiosError(error)) {
                // Network error handling
                if (error.code === 'ECONNABORTED' || !error.response) {
                    throw new Error('Network timeout or service unavailable. Please check your connection.');
                }
                // HTTP status error handling
                const status = error.response?.status;
                if (status === 401) throw new Error('Session expired. Please login again.');
                if (status === 403) throw new Error('You do not have permission to view this content.');
                if (status === 404) throw new Error('Products service unavailable.');
                if (status >= 500) throw new Error('Internal server error. Please try again later.');

                throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
            }
            throw error;
        }
    },
};
