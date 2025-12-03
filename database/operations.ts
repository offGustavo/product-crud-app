import database from './index';
import { User, Product, ProductFormData, UserFormData } from '../types';
import * as Crypto from 'expo-crypto';

export const UserOperations = {
  // Create a new user with hashed password
  async create(userData: UserFormData): Promise<number> {
    // Simple hash function (in production, use a more secure method)
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      userData.password
    );
    
    const sql = `
      INSERT INTO users (name, email, password) 
      VALUES (?, ?, ?)
    `;
    
    const result = await database.execute(sql, [
      userData.name,
      userData.email,
      hash
    ]);
    
    return result.insertId!;
  },

  // Get user by email
  async getByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await database.query<User>(sql, [email]);
    return users[0] || null;
  },

  // Get all users (for debugging/admin purposes)
  async getAll(): Promise<User[]> {
    const sql = 'SELECT * FROM users ORDER BY createdAt DESC';
    return await database.query<User>(sql);
  },

  // Verify user credentials
  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.getByEmail(email);
    if (!user) return null;

    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    return user.password === hash ? user : null;
  }
};

export const ProductOperations = {
  // Create a new product
  async create(productData: ProductFormData, userId: number): Promise<number> {
    const sql = `
      INSERT INTO products (name, description, quantity, active, userId) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await database.execute(sql, [
      productData.name,
      productData.description || '',
      productData.quantity || 0,
      1, // active by default
      userId
    ]);
    
    return result.insertId!;
  },

  // Get all active products for a user
  async getAll(userId: number, showInactive = false): Promise<Product[]> {
    let sql = 'SELECT * FROM products WHERE userId = ?';
    const params: any[] = [userId];
    
    if (!showInactive) {
      sql += ' AND active = 1';
    }
    
    sql += ' ORDER BY createdAt DESC';
    
    return await database.query<Product>(sql, params);
  },

  // Get product by ID
  async getById(id: number, userId: number): Promise<Product | null> {
    const sql = 'SELECT * FROM products WHERE id = ? AND userId = ?';
    const products = await database.query<Product>(sql, [id, userId]);
    return products[0] || null;
  },

  // Update product
  async update(id: number, productData: Partial<ProductFormData>, userId: number): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];

    if (productData.name !== undefined) {
      updates.push('name = ?');
      params.push(productData.name);
    }
    if (productData.description !== undefined) {
      updates.push('description = ?');
      params.push(productData.description);
    }
    if (productData.quantity !== undefined) {
      updates.push('quantity = ?');
      params.push(productData.quantity);
    }
    if (productData.active !== undefined) {
      updates.push('active = ?');
      params.push(productData.active ? 1 : 0);
    }

    if (updates.length === 0) {
      return false;
    }

    params.push(id, userId);
    
    const sql = `
      UPDATE products 
      SET ${updates.join(', ')} 
      WHERE id = ? AND userId = ?
    `;
    
    const result = await database.execute(sql, params);
    return result.rowsAffected > 0;
  },

  // Soft delete product
  async softDelete(id: number, userId: number): Promise<boolean> {
    const sql = 'UPDATE products SET active = 0 WHERE id = ? AND userId = ?';
    const result = await database.execute(sql, [id, userId]);
    return result.rowsAffected > 0;
  },

  // Hard delete product (for cleanup)
  async delete(id: number, userId: number): Promise<boolean> {
    const sql = 'DELETE FROM products WHERE id = ? AND userId = ?';
    const result = await database.execute(sql, [id, userId]);
    return result.rowsAffected > 0;
  },

  // Get product statistics
  async getStats(userId: number): Promise<{
    total: number;
    active: number;
    lowStock: number;
  }> {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN quantity <= 5 THEN 1 ELSE 0 END) as lowStock
      FROM products 
      WHERE userId = ?
    `;
    
    const result = await database.query<any>(sql, [userId]);
    return {
      total: result[0]?.total || 0,
      active: result[0]?.active || 0,
      lowStock: result[0]?.lowStock || 0
    };
  }
};
