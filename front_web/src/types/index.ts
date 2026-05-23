

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


export interface SaleDocumentLineRequest {
  productId: number;
  quantity: number;
}

export type DocumentType = 'QUOTE' | 'ORDER' | 'INVOICE' | 'DELIVERY_NOTE';


export interface SaleDocumentRequest {
  type: DocumentType;
  customerId: number;
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
    | 'CONFIRMED' | 'CANCELLED'                                                                                                                                                                        
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

