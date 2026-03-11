
import axios from "axios";
import type { Product } from "../types/index";

const API_BASE_URL = "http://localhost:8080";

export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_BASE_URL}/api/products?categoryId=${categoryId}`);
  return response.data;
};

export const getProductById = async (productId: number): Promise<Product> => {
  const response = await axios.get<Product>(`${API_BASE_URL}/api/products/${productId}`);
  return response.data;
};