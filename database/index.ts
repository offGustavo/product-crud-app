import * as SQLite from 'expo-sqlite';
import { DatabaseResult } from '../types';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('product-crud.db');
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
        active BOOLEAN DEFAULT 1,
        userId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
      CREATE INDEX IF NOT EXISTS idx_products_user ON products(userId);
    `;

    await this.db?.execAsync(sql);
  }

  async execute(sql: string, params: any[] = []): Promise<DatabaseResult> {
    if (!this.db) {
      await this.init();
    }

    try {
      const result = await this.db!.runAsync(sql, params);
      return {
        insertId: result.lastInsertRowId as number,
        rowsAffected: result.changes,
        rows: []
      };
    } catch (error) {
      console.error('Error executing SQL:', error);
      throw error;
    }
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) {
      await this.init();
    }

    try {
      const result = await this.db!.getAllAsync(sql, params);
      return result as T[];
    } catch (error) {
      console.error('Error querying database:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export default new Database();
