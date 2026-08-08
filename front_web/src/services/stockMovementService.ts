import api from '../api/axios';
import type { StockAdjustRequest, StockMovement, StockOutRequest } from '../types';

export const stockMovementService = {
  getAll: async (): Promise<StockMovement[]> => {
    const res = await api.get('/api/stock-movements');
    return res.data;
  },

  getRecent: async (): Promise<StockMovement[]> => {
    const res = await api.get('/api/stock-movements/recent');
    return res.data;
  },

  // Le contrôleur enveloppe la réponse dans { success, message, data }.
  out: async (request: StockOutRequest): Promise<StockMovement> => {
    const res = await api.post('/api/stock-movements/out', request);
    return res.data.data;
  },

  adjust: async (request: StockAdjustRequest): Promise<StockMovement> => {
    const res = await api.post('/api/stock-movements/adjust', request);
    return res.data.data;
  },
};
