import axios from 'axios';
import { deleteDataSecure, getDataSecure, setDataSecure } from "@/configs/libs/storage"; 
import { UserApi } from "@/configs/apis/UserApi";
import { BaseUrl } from './config';
import { navigationRef } from '../libs/navigation';

const apiClient = axios.create({
  baseURL: BaseUrl
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getDataSecure("token");
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        const response = await UserApi.refreshToken();

        const newAccessToken = response.data.result;
        await setDataSecure("token", newAccessToken);

        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        processQueue(null, newAccessToken);
        
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await deleteDataSecure("token");
        // Sử dụng navigationRef để điều hướng khi có lỗi
        if (navigationRef.isReady()) {
          navigationRef.navigate('signin', {}); 
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
