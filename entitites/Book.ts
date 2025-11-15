export interface Book {
  id: string;
  title: string;
  isbn: string;
  viewLink: string;
  pagesNumber: number;
  releaseDate: number;
  author: string | null;
  categories: string[];
  cover: string
}