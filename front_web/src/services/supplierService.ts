import api from '../api/axios';
import type { Supplier } from '../types';

export const supplierService = {
  create: async (supplier: Supplier): Promise<Supplier> => {
    const res = await api.post('/api/suppliers', supplier);
    return res.data.data;
  },

  getAll: async (): Promise<Supplier[]> => {
    const res = await api.get('/api/suppliers');
    return res.data;
  },

  search: async (keyword: string): Promise<Supplier[]> => {
    const res = await api.get('/api/suppliers/search', { params: { keyword } });
    return res.data;
  },
};
