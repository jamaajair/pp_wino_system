import api from '../api/axios';
import type { SaleDocumentResponse, SaleDocumentRequest } from '../types';

export const saleDocumentService = {
  getAll: async (): Promise<SaleDocumentResponse[]> => {
    const response = await api.get<SaleDocumentResponse[]>('/api/sale-documents');
    console.log('response', response.data);
    return response.data;
  },

  create: async (request: SaleDocumentRequest): Promise<SaleDocumentResponse> => {
    const response = await api.post<SaleDocumentResponse>('/api/sale-documents/all', request);
    return response.data;
  },

  convertDocument: async (documentNumber: string, targetType: string): Promise<SaleDocumentResponse> => {
    const response = await api.post<SaleDocumentResponse>(`/api/sale-documents/convert?documentNumber=${documentNumber}&targetType=${targetType}`);
    return response.data;
  },
};
