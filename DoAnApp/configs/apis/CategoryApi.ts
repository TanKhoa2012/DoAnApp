import axios, { AxiosRequestConfig } from "axios";
import { getDataSecure } from "../libs/storage";
import { BaseUrl } from "./config";

export const CategoryApi = {
    // Lấy tất cả danh mục
    getAllCategories: async (): Promise<any> => {
        return axios.get(`${BaseUrl}/categories`);
    },

    getMenuItemInCategory: async (categoriesId: number | any): Promise<any> => {
        const token = await getDataSecure("token");

        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axios.get(`${BaseUrl}/categories/menuitems/${categoriesId}`, config);
    },
    
    // Tạo danh mục mới với file đính kèm
    createCategory: async (categoryData: any, file: any): Promise<any> => {
        const token = await getDataSecure("token");
        const formData = new FormData();
        formData.append("request", JSON.stringify(categoryData));  // Thêm dữ liệu danh mục
        formData.append("file", file);  // Thêm tệp đính kèm

        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };
        return axios.post(`${BaseUrl}/categories`, formData, config);
    },

    // Xóa danh mục theo tên
    deleteCategory: async (categoryName: string): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: { 'Authorization': `Bearer ${token}` },
        };
        return axios.delete(`${BaseUrl}/categories/${categoryName}`, config);
    },
};
