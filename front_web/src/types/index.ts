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