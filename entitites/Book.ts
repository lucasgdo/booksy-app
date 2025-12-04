import {Author} from "@/entitites/Author";
import {Category} from "@/entitites/Category";

export interface Book {
  id: string;
  title: string;
  isbn: string;
  viewLink: string;
  pagesNumber: number;
  releaseDate: number;
  author: Author;
  categories: Category[];
  cover: string;
}