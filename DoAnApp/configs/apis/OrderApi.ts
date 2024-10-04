import axios, { AxiosRequestConfig } from "axios";
import { getDataSecure } from "../libs/storage";
import { BaseUrl } from "./config";

export const OrdersApi = {

    // Lấy tất cả đơn hàng
    getAllOrders: async (): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/orders`, config);
    },

    // Lấy đơn hàng theo ID người dùng
    getOrdersByUserId: async (userId: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/orders/user/${userId}`, config);
    },

    // Lấy đơn hàng theo ID cửa hàng
    getOrdersByStoreId: async (storeId: string): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/orders/store/${storeId}`, config);
    },

    getDateOrdersByStoreId:  async (storeId: number|undefined): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/orders/date/${storeId}`, config);
    },

    // Lấy đơn hàng theo ID đơn hàng
    getOrderById: async (orderId: string): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/orders/${orderId}`, config);
    },

    // Tạo đơn hàng mới
    createOrder: async (orderData: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.post(`${BaseUrl}/orders`, orderData, config);
    },

    // Cập nhật đơn hàng theo ID
    updateOrder: async (orderId: string, orderData: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.put(`${BaseUrl}/orders/${orderId}`, orderData, config);
    },

    // Xóa đơn hàng theo ID
    deleteOrder: async (orderId: string): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.delete(`${BaseUrl}/orders/${orderId}`, config);
    },
};
