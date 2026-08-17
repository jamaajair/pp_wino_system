import api from '../api/axios';
import type { SaleDocumentResponse, SaleDocumentRequest, SaleDocumentResult } from '../types';

export const saleDocumentService = {
  getAll: async (): Promise<SaleDocumentResponse[]> => {
    const response = await api.get<SaleDocumentResponse[]>('/api/sale-documents');
    console.log('response', response.data);
    return response.data;
  },

  create: async (request: SaleDocumentRequest): Promise<SaleDocumentResult> => {
    const response = await api.post<SaleDocumentResult>('/api/sale-documents', request);
    return response.data;
  },

  convertDocument: async (documentNumber: string, targetType: string): Promise<SaleDocumentResult> => {
    const response = await api.post<SaleDocumentResult>(
      `/api/sale-documents/convert?documentNumber=${encodeURIComponent(documentNumber)}&targetType=${targetType}`);
    return response.data;
  },
};
