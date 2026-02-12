import apiClient from './apiClient';
import { Category, CategoryFilterInput } from '@/types/category';

export const categoryService = {
    getAll: async (filters?: CategoryFilterInput): Promise<Category[]> => {
        const query = `
      query GetCategories($filters: CategoryFilterInput) {
        categories(filters: $filters) {
          success
          message
          totalCount
          categories {
            id
            name
            slug
            description
            isActive
            sortOrder
            parentId
            children {
              id
              name
              slug
            }
          }
        }
      }
    `;

        try {
            const response = await apiClient.post('', {
                query,
                variables: { filters },
            });

            if (response.data.errors) {
                console.error('GraphQL Errors:', response.data.errors);
                throw new Error(response.data.errors[0].message);
            }

            const { data } = response.data;
            if (!data.categories.success) {
                throw new Error(data.categories.message || 'Failed to fetch categories');
            }

            return data.categories.categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Return empty array instead of throwing to avoid breaking the UI completely
            return [];
        }
    }

};
