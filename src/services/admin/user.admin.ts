import apiClient from '@/services/apiClient';
import { AdminUser } from '@/features/admin/users/users.types';

// Helper to map backend response to frontend types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapUserFromGQL = (u: any): AdminUser => ({
  id: u.id,
  username: u.username,
  phoneNumber: u.phoneNumber,
  isPhoneVerified: u.isPhoneVerified,
  role: u.role,
  email: u.email,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});

export const adminUserAPI = {
  getAll: async () => {
    const query = `
      query GetAllUsers {
        users {
          id
          username
          phoneNumber
          isPhoneVerified
          role
          email
          createdAt
          updatedAt
        }
      }
    `;
    const response = await apiClient.post('', { query });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return { data: response.data.data.users.map(mapUserFromGQL) };
  },
};
