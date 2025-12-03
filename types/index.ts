export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  active: boolean;
  userId: number;
  createdAt: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'active'> & {
  active?: boolean;
};

export type UserFormData = Omit<User, 'id' | 'createdAt'>;

export interface DatabaseResult {
  insertId?: number;
  rowsAffected: number;
  rows: any;
}
