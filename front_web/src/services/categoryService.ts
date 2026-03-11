import axios from 'axios';
import type { Category } from '../types/index';

const API_BASE_URL = 'http://localhost:8080';

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${API_BASE_URL}/api/categories`);
  return response.data;
};