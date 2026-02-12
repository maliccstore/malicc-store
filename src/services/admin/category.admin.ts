import apiClient from '@/services/apiClient';
import { AdminCategory } from '@/features/admin/categories/category.types';

export const adminCategoryAPI = {
    getAll: async (filters?: { isActive?: boolean; search?: string }) => {
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
            parent {
              id
              name
            }
            children {
              id
              name
              slug
            }
            createdAt
            updatedAt
          }
        }
      }
    `;

        const response = await apiClient.post('', {
            query,
            variables: { filters },
        });

        if (response.data.errors) throw new Error(response.data.errors[0].message);

        // Ensure we return the correct structure
        const result = response.data.data.categories;
        return {
            data: result.categories as AdminCategory[],
            totalCount: result.totalCount
        };
    },

    getById: async (id: string) => {
        const query = `
      query GetCategory($id: String!) {
        category(id: $id) {
          success
          message
          category {
            id
            name
            slug
            description
            isActive
            sortOrder
            parentId
            parent {
              id
              name
            }
          }
        }
      }
    `;
        const response = await apiClient.post('', { query, variables: { id } });
        if (response.data.errors) throw new Error(response.data.errors[0].message);

        const result = response.data.data.category;
        if (!result.success) throw new Error(result.message);

        return { data: result.category as AdminCategory };
    },

    create: async (data: Partial<AdminCategory>) => {
        const query = `
      mutation CreateCategory($input: CreateCategoryInput!) {
        createCategory(input: $input) {
          success
          message
          category {
            id
            name
            slug
            description
            isActive
            sortOrder
            parentId
          }
        }
      }
    `;

        const input = {
            name: data.name,
            slug: data.slug,
            description: data.description,
            isActive: data.isActive,
            parentId: data.parentId || null, // Ensure explicit null if undefined
            sortOrder: data.sortOrder,
        };

        const response = await apiClient.post('', { query, variables: { input } });
        if (response.data.errors) throw new Error(response.data.errors[0].message);

        const result = response.data.data.createCategory;
        if (!result.success) throw new Error(result.message);

        return { data: result.category as AdminCategory };
    },

    update: async (id: string, data: Partial<AdminCategory>) => {
        const query = `
      mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
        updateCategory(id: $id, input: $input) {
          success
          message
          category {
            id
            name
            slug
            description
            isActive
            sortOrder
            parentId
          }
        }
      }
    `;

        const input = {
            name: data.name,
            slug: data.slug,
            description: data.description,
            isActive: data.isActive,
            parentId: data.parentId || null,
            sortOrder: data.sortOrder,
        };

        const response = await apiClient.post('', { query, variables: { id, input } });
        if (response.data.errors) throw new Error(response.data.errors[0].message);

        const result = response.data.data.updateCategory;
        if (!result.success) throw new Error(result.message);

        return { data: result.category as AdminCategory };
    },

    delete: async (id: string) => {
        const query = `
      mutation DeleteCategory($id: String!) {
        deleteCategory(id: $id) {
          success
          message
        }
      }
    `;
        const response = await apiClient.post('', { query, variables: { id } });
        if (response.data.errors) throw new Error(response.data.errors[0].message);

        const result = response.data.data.deleteCategory;
        if (!result.success) throw new Error(result.message);

        return { data: result };
    },
};
