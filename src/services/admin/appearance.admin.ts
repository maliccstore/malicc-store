import apiClient from '@/services/apiClient';
import { StoreAppearance } from '@/types/appearance';
import axios from 'axios';
import Cookies from 'js-cookie';

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL || '';
const baseUrl = restApiUrl.replace('/api', '');

export const appearanceAdminAPI = {
  getAppearance: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiClient.get<any>(`${restApiUrl}/admin/appearance`);
    const data = response.data.data;
    if (data && data.logo_url && data.logo_url.startsWith('/')) {
      data.logo_url = `${baseUrl}${data.logo_url}`;
    }
    return { data };
  },

  updateAppearance: async (data: Partial<StoreAppearance>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiClient.patch<any>(`${restApiUrl}/admin/appearance`, data);
    const responseData = response.data.data;
    if (responseData && responseData.logo_url && responseData.logo_url.startsWith('/')) {
      responseData.logo_url = `${baseUrl}${responseData.logo_url}`;
    }
    return { data: responseData };
  },

  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const token = Cookies.get("auth-token");

    const response = await axios.post(
      `${restApiUrl}/admin/appearance/logo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      }
    );

    if (response.data && response.data.success && response.data.data?.url) {
      return { logo_url: response.data.data.url };
    }

    throw new Error(response.data?.message || "Logo upload failed");
  },

  deleteLogo: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiClient.delete<any>(`${restApiUrl}/admin/appearance/logo`);
    return { data: response.data.data };
  }
};
