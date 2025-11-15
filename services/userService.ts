import { UserRequest, UserResponse } from "@/entitites/User";
import api from "./api";

export const userService = {
    async getAllUsers(): Promise<UserResponse[]> {
        const response = await api.get('/users');
        return response.data;
    },

    async getUserById (id: string): Promise<UserResponse> {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async getUserByEmail (email: string): Promise<UserResponse> {
        const response = await api.get(`/users/email/${email}`);
        return response.data;
    },

    async createUser (user: UserRequest): Promise<UserResponse> {
        const response = await api.post('/users', user);
        return response.data;
    },

    async updateUser (id: string, user: UserRequest): Promise<UserResponse>{
        const response = await api.put(`/users/${id}`, user);
        return response.data;
    },
    async deleteUser(id: string): Promise<void>{
        await api.delete(`/users/${id}`);
    },
};


