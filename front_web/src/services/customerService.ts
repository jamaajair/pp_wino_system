import api from '../api/axios';
import type { Customer } from '../types';

export const customerService = {
  create: async (customer: Customer): Promise<Customer> => {
    const res = await api.post('/api/customers', customer);
    return res.data.data;
  },

  search: async (query: string): Promise<Customer[]> => {
    console.log('Search customers response:', query);
    const res = await api.get('/api/customers/value', { params: { keyword: query } });
    console.log('Search customers response:', res.data.data ?? res.data);
    return res.data.data ?? res.data;
  },
};