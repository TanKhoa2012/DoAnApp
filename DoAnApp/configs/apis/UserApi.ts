import axios, { AxiosRequestConfig } from "axios";
import { LoginState } from "@/types";
import { BaseUrl } from "./config";
import { deleteDataSecure, getDataSecure } from "../libs/storage";

export const UserApi = {
    logout: async (): Promise<any> => {
        const token = await getDataSecure("token");

        await deleteDataSecure("token");
       
        return axios.post(`${BaseUrl}/auth/logout`,{
            token:token
        });
    },
    // Tạo một người dùng mới
    createUser: async (formData: any): Promise<any> => {
        return axios.post(`${BaseUrl}/users`, formData);
    },

    // Lấy danh sách người dùng
    getUsers: async (): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: { 'Authorization': `Bearer ${token}` },
        };
        return axios.get(`${BaseUrl}/users`, config);
    },

    // Lấy thông tin người dùng theo token
    getUserByToken: async (): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: { 'Authorization': `Bearer ${token}` },
        };
        return axios.get(`${BaseUrl}/users/userInfo`, config);
    },

    // Lấy thông tin người dùng theo ID
    getUserById: async (userId: string): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: { 'Authorization': `Bearer ${token}` },
        };
        return axios.get(`${BaseUrl}/users/${userId}`, config);
    },

    // Lấy token đăng nhập
    getToken: async (params: LoginState): Promise<any> => {
        
        return await axios.post(`${BaseUrl}/auth/login`, {
            username: params.username,
            password: params.password
        });
    },

    // Làm mới token
    refreshToken: async (): Promise<any> => {
        const token = await getDataSecure("token");
        return axios.post(`${BaseUrl}/auth/refresh`, { token });
    },

    // Lấy thông tin người dùng theo danh sách usernames
    getUserByUsernames: async (usernames: string[]): Promise<any> => {
        return axios.get(`${BaseUrl}/api/user/bulk`, {
            params: { usernames: usernames.join(',') },
        });
    },

    // Lấy thông tin người dùng theo username
    getUserByUsername: async (username: string): Promise<any> => {
        return axios.get(`${BaseUrl}/api/user/${username}`);
    },

    // Xóa người dùng theo ID
    deleteUser: async (userId: string|undefined): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: { 'Authorization': `Bearer ${token}` },
        };
        return axios.delete(`${BaseUrl}/users/${userId}`, config);
    },

    // Cập nhật thông tin người dùng
    updateUser: async (userId: string|undefined, formData: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: { 'Authorization': `Bearer ${token}` },
        };
        return axios.put(`${BaseUrl}/users/${userId}`, formData, config);
    },

    // Cập nhật avatar người dùng
    updateAvatar: async (userId: string|undefined, file: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };
        return axios.put(`${BaseUrl}/users/updateAvatar/${userId}`, file, config);
    },

    updateBackground: async (userId: string|undefined, file: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };
        return axios.put(`${BaseUrl}/users/updateBackground/${userId}`, file, config);
    },

    // Thay đổi mật khẩu
    changePassword: async (passwordData: any): Promise<any> => {
        const token = await getDataSecure("token");
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        return axios.patch(`${BaseUrl}/users/update_password`, passwordData, config);
    },
};
