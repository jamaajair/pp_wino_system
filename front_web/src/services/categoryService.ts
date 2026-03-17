import api from "../api/axios";
import type { Category } from "../types/index";

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>(`/api/categories`);
  return response.data;
};
