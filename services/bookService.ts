import api from './api';
import {Book} from "@/entitites/Book";

export interface CreateBookDto {
    title: string;
    isbn: string;
    uploadId?: string;
    viewLink?: string;
    pagesNumber: number;
    releaseDate?: number;
    authorId: string;
    cover?: string;
    categoryIds?: string[];
}

export const bookService = {
    async listBooks(): Promise<Book[]> {
        const response = await api.get("/books");
        return response.data;
    },

    async getBook(id: string): Promise<Book> {
        const response = await api.get(`/books/${id}`);
        return response.data;
    },

    async createBook(bookData: CreateBookDto): Promise<Book> {
        const response = await api.post("/books", bookData);
        return response.data;
    },

    async uploadBookFile(
        id: string,
        file: { uri: string; name: string; type: string },
    ): Promise<string> {
        const formData = new FormData();
        formData.append("file", {
            uri: file.uri,
            name: file.name,
            type: file.type,
        } as any);

        const response = await api.patch(`/books/${id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};