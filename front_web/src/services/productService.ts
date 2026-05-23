import api from "../api/axios";
import type { Product, SaleDocumentRequest } from "../types/index";


export const productService = {
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/api/products?categoryId=${categoryId}`);
    return response.data;
  },

  getProductById: async (productId: number): Promise<Product> => {
    const response = await api.get<Product>(`/api/products/${productId}`);
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/api/products/search`, { params: { keyword: query } });
    return response.data;
  },

  createSaleDocument: async (request: SaleDocumentRequest): Promise<void> => {
    const answer = await api.post('/api/sale-documents', request);
    return answer.data;
  }
};
