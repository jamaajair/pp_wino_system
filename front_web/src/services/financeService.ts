import api from '../api/axios';
import type {
  FinancialAccount, FinancialAccountRequest,
  FinancialTransaction, FinancialTransactionRequest,
} from '../types';

export const financeService = {
  // ---- Comptes ----
  getAccounts: async (): Promise<FinancialAccount[]> => {
    const res = await api.get('/api/financial-accounts');
    return res.data;
  },

  getTotalBalance: async (): Promise<number> => {
    const res = await api.get('/api/financial-accounts/total-balance');
    return Number(res.data.totalBalance ?? 0);
  },

  createAccount: async (account: FinancialAccountRequest): Promise<FinancialAccount> => {
    const res = await api.post('/api/financial-accounts', account);
    return res.data.data;
  },

  toggleAccountActive: async (id: number): Promise<FinancialAccount> => {
    const res = await api.patch(`/api/financial-accounts/${id}/toggle-active`);
    return res.data.data;
  },

  // ---- Transactions ----
  getTransactionsByAccount: async (accountId: number): Promise<FinancialTransaction[]> => {
    const res = await api.get(`/api/financial-transactions/account/${accountId}`);
    return res.data;
  },

  createTransaction: async (transaction: FinancialTransactionRequest): Promise<FinancialTransaction> => {
    const res = await api.post('/api/financial-transactions', transaction);
    return res.data.data;
  },

  applyTransaction: async (id: number, validatedByUserId?: number): Promise<FinancialTransaction> => {
    const body = validatedByUserId ? { validatedByUserId } : undefined;
    const res = await api.patch(`/api/financial-transactions/${id}/apply`, body);
    return res.data.data;
  },
};
