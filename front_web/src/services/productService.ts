import api from "../api/axios";
import type { Product, SaleDocumentRequest, SaleDocumentResult } from "../types/index";


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

  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/api/products`);
    return response.data;
  },

  getLowStock: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/api/products/low-stock`);
    return response.data;
  },

  createSaleDocument: async (request: SaleDocumentRequest): Promise<SaleDocumentResult> => {
    const answer = await api.post<SaleDocumentResult>('/api/sale-documents', request);
    return answer.data;
  }
};
