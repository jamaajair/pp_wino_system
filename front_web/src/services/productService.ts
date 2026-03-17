import api from "../api/axios";
import type { Product } from "../types/index";

export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  const response = await api.get<Product[]>(`/api/products?categoryId=${categoryId}`);
  return response.data;
};

export const getProductById = async (productId: number): Promise<Product> => {
  const response = await api.get<Product>(`/api/products/${productId}`);
  return response.data;
};
