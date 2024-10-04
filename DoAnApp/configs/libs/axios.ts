import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDataSecure } from './storage';

const BASE_URL = 'http://your-api-base-url.com/api';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  requiresToken?: boolean;
  _retry?: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: CustomInternalAxiosRequestConfig) => {
    if (config.requiresToken !== false) {
      const token = await getDataSecure('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post<{ token: string }>(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { token } = response.data;

        await AsyncStorage.setItem('userToken', token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
        // Add logic to redirect user to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Custom method to send request
async function sendRequest<T = any>(
  method: string, 
  url: string, 
  data: any = null, 
  config: AxiosRequestConfig & { requiresToken?: boolean } = {}
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Utility methods
const axiosCustome = {
  get: <T = any>(url: string, config?: AxiosRequestConfig & { requiresToken?: boolean }) => 
    sendRequest<T>('get', url, null, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig & { requiresToken?: boolean }) => 
    sendRequest<T>('post', url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig & { requiresToken?: boolean }) => 
    sendRequest<T>('put', url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig & { requiresToken?: boolean }) => 
    sendRequest<T>('delete', url, null, config),
  // Add other methods if needed
};

export default axiosCustome;