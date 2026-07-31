import api from '../api/axios';
import type { PurchaseDocumentRequest, PurchaseDocumentResponse } from '../types';

export const purchaseDocumentService = {
  getAll: async (): Promise<PurchaseDocumentResponse[]> => {
    const res = await api.get('/api/purchase-documents');
    return res.data;
  },

  create: async (request: PurchaseDocumentRequest): Promise<PurchaseDocumentResponse> => {
    const res = await api.post('/api/purchase-documents', request);
    return res.data.data;
  },

  updateStock: async (id: number): Promise<PurchaseDocumentResponse> => {
    const res = await api.patch(`/api/purchase-documents/${id}/update-stock`);
    return res.data.data;
  },
};
