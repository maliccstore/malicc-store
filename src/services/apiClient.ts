// src/services/apiClient.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  // baseURL: 'https://api.malicc.com/graphql',
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
