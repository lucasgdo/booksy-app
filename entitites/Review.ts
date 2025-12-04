import {User} from "@/entitites/User";
import {Book} from "@/entitites/Book";

export interface Review {
    id: string;
    user: User;
    book: Book;
    rating: number;
    title: string;
    textPost: string;
    postDate: string;
}