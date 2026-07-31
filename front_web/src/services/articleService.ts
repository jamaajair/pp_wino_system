import api from '../api/axios';
import type { Article } from '../types';

export const articleService = {
  search: async (keyword: string): Promise<Article[]> => {
    const response = await api.get<Article[]>('/api/products/search', { params: { keyword } });
    return response.data;
  },

  getById: async (id: number): Promise<Article> => {
    const response = await api.get<Article>(`/api/products/${id}`);
    return response.data;
  },
};
