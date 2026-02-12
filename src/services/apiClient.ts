import axios from 'axios';
import Cookies from "js-cookie";

const apiClient = axios.create({
  // baseURL: 'https://api.malicc.store',
  baseURL: 'http://localhost:8000/graphql',
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
