

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  salePrice: number;
  image?: string;
  tva: number;
  unit: string;
  qteColis: number;
  stockQuantity: number;
  purchasePrice: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export type CustomerType = 'INDIVIDUAL' | 'COMPANY';

export interface Customer {
  id?: number;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  taxId?: string;
  customerType: CustomerType;
  creditLimit?: number;
  balance?: number;
  active?: boolean;
}

export interface Article {
  id?: number;
  code: string;
  name: string;
  description?: string;
  salePrice: number;
  purchasePrice: number;
  tva: number;
  unit: string;
  qteColis: number;
  stockQuantity: number;
  categoryId?: number; // ID de la catégorie à laquelle appartient l'article
}

export interface Supplier {
  id?: number;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  taxId?: string;
  contactPerson?: string;
  paymentTerms?: number; // délai de paiement en jours (30, 60, 90…)
  active?: boolean;
}


export interface SaleDocumentLineRequest {
  productId: number;
  quantity: number;
}

export type DocumentType = 'QUOTE' | 'ORDER' | 'INVOICE' | 'DELIVERY_NOTE' | 'CREDIT_NOTE' ;


export interface SaleDocumentRequest {
  type: DocumentType;
  customerId: number;
  status?: SaleDocumentStatus;
  lines: SaleDocumentLineRequest[];
}


export interface SaleDocumentLineResponse {
  productId: number;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type SaleDocumentStatus =                                                                                                                                                                          
    | 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
    | 'CONFIRMED' | 'CANCELLED'  | 'FINALIZED'                                                                                                                                                                        
    | 'IN_PREPARATION' | 'SHIPPED' | 'DELIVERED'                                                                                                                                                       
    | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'REFUNDED';  


export interface SaleDocumentResponse {
  documentNumber: string;
  type: DocumentType;
  customerId: number;
  documentDate: string;
  dueDate?: string;
  notes?: string;
  status?: SaleDocumentStatus;
  lines: SaleDocumentLineResponse[];
  createdAt: string;
  updatedAt: string;
  convertedFromDocumentNumber?: string | null;
}


export type PurchaseDocumentType = 'REQUEST' | 'ORDER' | 'RECEIPT' | 'INVOICE';

export interface PurchaseLineRequest {
  product: { id: number };
  quantity: number;
  unitPrice: number;
}

export interface PurchaseDocumentRequest {
  type: PurchaseDocumentType;
  supplier: { id: number };
  documentDate?: string;
  dueDate?: string;
  notes?: string;
  status?: string;
  lines: PurchaseLineRequest[];
}

export interface PurchaseDocumentResponse {
  id: number;
  documentNumber: string;
  type: PurchaseDocumentType;
  documentDate: string;
  dueDate?: string;
  notes?: string;
  status?: string;
  stockUpdated?: boolean;
  totalAmount?: number;
}


export type AccountType = 'BANK' | 'CASH' | 'CREDIT_CARD' | 'SAVINGS' | 'INVESTMENT';
export type TransactionType = 'CREDIT' | 'DEBIT';

export interface FinancialAccount {
  id?: number;
  accountNumber: string;
  accountName: string;
  accountType: AccountType;
  balance?: number;
  currency?: string;
  description?: string;
  active?: boolean;
}

export interface FinancialAccountRequest {
  accountNumber: string;
  accountName: string;
  accountType: AccountType;
  currency: string;
  balance: number;
  description?: string;
}

export interface FinancialTransactionRequest {
  account: { id: number };
  transactionType: TransactionType;
  amount: number;
  transactionDate?: string;
  description?: string;
  reference?: string;
  category?: string;
  createdBy?: { id: number };
}

export interface FinancialTransaction {
  id: number;
  transactionNumber: string;
  transactionType: TransactionType;
  amount: number;
  transactionDate: string;
  description?: string;
  reference?: string;
  category?: string;
  applied: boolean;
  // Enrichi côté client (account est @JsonBackReference côté backend, non sérialisé)
  accountId?: number;
  accountName?: string;
}

