import {Author} from "@/entitites/Author";
import api from "./api";

export interface CreateAuthorDto {
    firstName: string;
    lastName: string;
    originCountry: string;
    birthYear: number;
}

export const authorService = {
    async listAuthors(): Promise<Author[]> {
        const response = await api.get('/authors');
        return response.data;
    },

    async createAuthor(authorData: CreateAuthorDto): Promise<Author> {
        const response = await api.post("/authors", authorData);
        return response.data;
    },
}