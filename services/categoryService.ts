import api from './api';
import {Category} from "@/entitites/Category";

export const categoryService = {
    async listCategories(): Promise<Category[]> {
        const response = await api.get("/categories");
        return response.data;
    },
};