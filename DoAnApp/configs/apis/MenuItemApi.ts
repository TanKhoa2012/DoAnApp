import axios, { AxiosRequestConfig } from "axios";
import { BaseUrl } from "./config";
import { getDataSecure } from "../libs/storage";

export const MenuItemsApi = {
    // Lấy tất cả món ăn
    getAllMenuItems: async (): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/menuitems`, config);
    },

    // Lấy món ăn theo ID
    getMenuItemById: async (menuItemsId: number): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/menuitems/${menuItemsId}`, config);
    },

    getMenuItemsByStoreId: async (storeId: number): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/menuitems/store/${storeId}`, config);
    },

    getMenuItemByName: async (name: string|undefined): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/menuitems/searchName/${name}`, config);
    },

    getMenuItemByCateId: async (name: string|undefined): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/menuitems/filter/${name}`, config);
    },

    // Tạo món ăn mới với dữ liệu
    createMenuItem: async (formData: FormData): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };
        return axios.post(`${BaseUrl}/menuitems`, formData, config);
    },

    // Xóa món ăn theo ID
    deleteMenuItem: async (menuItemsId: number): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.delete(`${BaseUrl}/menuitems/${menuItemsId}`, config);
    },

    // Cập nhật món ăn theo ID
    updateMenuItem: async (menuItemId: number, menuItemData: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.put(`${BaseUrl}/menuitems/${menuItemId}`, menuItemData, config);
    },
};
