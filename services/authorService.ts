import {Author} from "@/entitites/Author";
import api from "./api";

export const authorService = {
    async listAuthors(): Promise<Author[]> {
        const response = await api.get('/authors');
        return response.data;
    },
}