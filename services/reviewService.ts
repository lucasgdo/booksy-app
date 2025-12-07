import { Review } from "@/entitites/Review";
import api from './api';

export const reviewService = {
    async listReviews(): Promise<Review[]> {
        const response = await api.get("/reviews");
        return response.data;
    },

   async createReview(data: {
        bookId: string;
        rating: number;
        title: string;
        textPost: string;
        userId: string;
    }): Promise<Review> {
        const response = await api.post("/reviews", data);
        return response.data;
    }

};