import api from './api';
import {Reading} from "@/entitites/Reading";

export interface CreateReadingDTO {
    userId: string | null;
    bookId: string;
    currentPage: number;
}

export const readingService = {
    async listReadings(): Promise<Reading[]> {
        const response = await api.get("/readings");
        return response.data;
    },

    async createReading(readingData: CreateReadingDTO): Promise<Reading> {
        const response = await api.post("/readings", readingData);
        return response.data;
    },

    async updateReading(readingData: CreateReadingDTO): Promise<Reading> {
        const response = await api.put("/readings", readingData);
        return response.data;
    }
};