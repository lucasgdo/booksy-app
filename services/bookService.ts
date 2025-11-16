import api from './api';

export const bookService = {
  async listBooks() {
    const response = await api.get('/books');
    return response.data;
  },
};