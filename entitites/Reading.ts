import {User} from "@/entitites/User";
import {Book} from "@/entitites/Book";

export interface Reading {
    id: string;
    user: User;
    book: Book;
    currentPage: number;
    startDate: string;
    endDate: string;
}