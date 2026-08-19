import api from '../api/axios';
import type { Article, ProductCreateRequest } from '../types';

export const articleService = {
  search: async (keyword: string): Promise<Article[]> => {
    const response = await api.get<Article[]>('/api/products/search', { params: { keyword } });
    return response.data;
  },

  getById: async (id: number): Promise<Article> => {
    const response = await api.get<Article>(`/api/products/${id}`);
    return response.data;
  },

  // POST /api/products attend la forme de l'entité Product : la catégorie voyage
  // comme objet imbriqué { id }, pas comme categoryId à plat (cf. ProductService
  // .createProduct, qui lit product.getCategory().getId()).
  // Le contrôleur enveloppe la réponse dans { success, message, data }.
  create: async (product: ProductCreateRequest): Promise<Article> => {
    const response = await api.post('/api/products', product);
    return response.data.data;
  },
};
