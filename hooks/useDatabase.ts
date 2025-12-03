import { useEffect, useState } from 'react';
import database from '../database';
import { UserOperations, ProductOperations } from '../database/operations';
import { User, Product, ProductFormData, UserFormData } from '../types';

export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        await database.init();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDB();
  }, []);

  return {
    isInitialized,
    UserOperations,
    ProductOperations
  };
};

export const useProducts = (userId: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isInitialized, ProductOperations } = useDatabase();

  const loadProducts = async (showInactive = false) => {
    if (!isInitialized || !userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await ProductOperations.getAll(userId, showInactive);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: ProductFormData) => {
    try {
      const id = await ProductOperations.create(productData, userId);
      await loadProducts();
      return id;
    } catch (err) {
      setError('Failed to add product');
      throw err;
    }
  };

  const updateProduct = async (id: number, productData: Partial<ProductFormData>) => {
    try {
      const success = await ProductOperations.update(id, productData, userId);
      if (success) {
        await loadProducts();
      }
      return success;
    } catch (err) {
      setError('Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const success = await ProductOperations.softDelete(id, userId);
      if (success) {
        await loadProducts();
      }
      return success;
    } catch (err) {
      setError('Failed to delete product');
      throw err;
    }
  };

  const getProductStats = async () => {
    try {
      return await ProductOperations.getStats(userId);
    } catch (err) {
      setError('Failed to get product statistics');
      throw err;
    }
  };

  useEffect(() => {
    if (isInitialized && userId) {
      loadProducts();
    }
  }, [isInitialized, userId]);

  return {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductStats
  };
};

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { isInitialized, UserOperations } = useDatabase();

  const register = async (userData: UserFormData) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      setLoading(true);
      
      // Check if email already exists
      const existingUser = await UserOperations.getByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const userId = await UserOperations.create(userData);
      
      // Get the created user
      const user = await UserOperations.getByEmail(userData.email);
      setCurrentUser(user);
      
      return userId;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      setLoading(true);
      const user = await UserOperations.verifyCredentials(email, password);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const checkExistingUser = async () => {
    if (!isInitialized) return;

    try {
      const users = await UserOperations.getAll();
      if (users.length > 0) {
        setCurrentUser(users[0]); // Auto-login first user for simplicity
      }
    } catch (error) {
      console.error('Error checking existing users:', error);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      checkExistingUser();
    }
  }, [isInitialized]);

  return {
    currentUser,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser
  };
};
