import axios, { AxiosRequestConfig } from "axios";
import { BaseUrl } from "./config";
import { getDataSecure } from "../libs/storage";

export const LikeItemsApi = {
    // Lấy tất cả Likeitems
    getAllLikeitems: async (): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/likeitems`, config);
    },

    // Lấy Likeitems theo ID người dùng
    getLikeitemsByUserId: async (userId: string|undefined): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/likeitems/users/${userId}`, config);
    },

    // Lấy Likeitems theo ID menu item
    getLikeitemsByMenuItemsId: async (menuItemsId: string): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/likeitems/${menuItemsId}`, config);
    },

    // Tạo Likeitems mới
    createLikeitems: async (userId:any, menuitemId:any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.post(`${BaseUrl}/likeitems`, {
            userId: userId,
            menuItemsId: menuitemId
        }, config);
    },
    
    checkLikeItems: async (userId: any, menuItemsId: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/likeitems/${userId}/${menuItemsId}`, config);
    },

    // Xóa Likeitems theo ID người dùng và menu item
    deleteLikeitems: async (userId: any, menuItemsId: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.delete(`${BaseUrl}/likeitems/${userId}/${menuItemsId}`, config);
    },
};
