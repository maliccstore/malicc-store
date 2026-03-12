import apiClient from './apiClient';
import { Product, ProductFilterInput } from '@/types/product';
import { Review, ProductRatingSummary, CreateReviewInput, UpdateReviewInput } from '@/types/review';

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

    getProductReviews: async (productId: string): Promise<Review[]> => {
        try {
            const query = `
        query GetProductReviews($productId: ID!) {
          productReviews(productId: $productId) {
            id
            userId
            productId
            rating
            reviewText
            status
            createdAt
          }
        }
      `;

            const response = await apiClient.post('', {
                query,
                variables: { productId },
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data.productReviews;
        } catch (error) {
            console.error('Error fetching product reviews:', error);
            throw error;
        }
    },

    getProductRatingSummary: async (productId: string): Promise<ProductRatingSummary> => {
        try {
            const query = `
        query GetProductRatingSummary($productId: ID!) {
          productRatingSummary(productId: $productId) {
            averageRating
            totalReviews
          }
        }
      `;

            const response = await apiClient.post('', {
                query,
                variables: { productId },
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data.productRatingSummary;
        } catch (error) {
            console.error('Error fetching product rating summary:', error);
            throw error;
        }
    },

    createReview: async (input: CreateReviewInput): Promise<Review> => {
        try {
            const query = `
        mutation CreateReview($input: CreateReviewInput!) {
          createReview(input: $input) {
            id
            userId
            productId
            rating
            reviewText
            status
            createdAt
          }
        }
      `;

            const response = await apiClient.post('', {
                query,
                variables: { input },
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data.createReview;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    updateReview: async (id: string, input: UpdateReviewInput): Promise<Review> => {
        try {
            const query = `
        mutation UpdateReview($id: ID!, $input: UpdateReviewInput!) {
          updateReview(id: $id, input: $input) {
            id
            userId
            productId
            rating
            reviewText
            status
            createdAt
          }
        }
      `;

            const response = await apiClient.post('', {
                query,
                variables: { id, input },
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data.updateReview;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    },

    deleteReview: async (id: string): Promise<boolean> => {
        try {
            const query = `
        mutation DeleteReview($id: ID!) {
          deleteReview(id: $id)
        }
      `;

            const response = await apiClient.post('', {
                query,
                variables: { id },
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data.deleteReview;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    },

};
