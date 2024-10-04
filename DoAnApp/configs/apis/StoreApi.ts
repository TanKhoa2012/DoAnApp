import axios, { AxiosRequestConfig } from "axios";
import { BaseUrl } from "./config";
import { getDataSecure } from "../libs/storage";

export const StoreApi = {
    // Lấy tất cả cửa hàng
    getAllStores: async (): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/stores`, config);
    },

    // Lấy cửa hàng theo ID người dùng
    getStoreByUserId: async (userId: string): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/stores/${userId}`, config);
    },

    // Tạo cửa hàng mới
    createStore: async (formData: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.post(`${BaseUrl}/stores`, formData, config);
    },

    // Xóa cửa hàng theo ID
    deleteStore: async (storeId: string): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.delete(`${BaseUrl}/stores/${storeId}`, config);
    },

    // Cập nhật ảnh đại diện của cửa hàng
    updateAvatar: async (storeId: string, file: File): Promise<any> => {
        const token = await getDataSecure("token");
        const formData = new FormData();
        formData.append("file", file);

        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };
        return axios.put(`${BaseUrl}/stores/updateAvatar/${storeId}`, formData, config);
    },

    // Cập nhật ảnh nền của cửa hàng
    updateBackground: async (storeId: string, file: File): Promise<any> => {
        const token = await getDataSecure("token");
        const formData = new FormData();
        formData.append("file", file);

        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };
        return axios.put(`${BaseUrl}/stores/updateBg/${storeId}`, formData, config);
    },

    // Cập nhật thông tin cửa hàng
    updateStore: async (storeId: string, formData: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.put(`${BaseUrl}/stores/${storeId}`, formData, config);
    },
};
