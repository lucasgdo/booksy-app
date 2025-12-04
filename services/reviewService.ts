import api from './api';
import {Review} from "@/entitites/Review";

export const reviewService = {
    async listReviews(): Promise<Review[]> {
        const response = await api.get("/reviews");
        return response.data;
    }
};