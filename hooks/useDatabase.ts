import { useEffect, useState, useRef, useCallback } from "react";
import database from "../database";
import { UserOperations, ProductOperations } from "../database/operations";
import { User, Product, ProductFormData, UserFormData } from "../types";

export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        await database.init();
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    initDB();
  }, []);

  return {
    isInitialized,
    UserOperations,
    ProductOperations,
  };
};

export const useProducts = (userId: number | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isInitialized, ProductOperations } = useDatabase();
  const hasLoadedRef = useRef(false);

  const loadProducts = async (showInactive = false) => {
    if (!isInitialized || !userId || userId === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ProductOperations.getAll(userId, showInactive);
      setProducts(data);
      hasLoadedRef.current = true;
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: ProductFormData) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    try {
      const id = await ProductOperations.create(productData, userId);
      await loadProducts();
      return id;
    } catch (err) {
      setError("Failed to add product");
      throw err;
    }
  };

  const updateProduct = async (
    id: number,
    productData: Partial<ProductFormData>,
  ) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    try {
      const success = await ProductOperations.update(id, productData, userId);
      if (success) {
        await loadProducts();
      }
      return success;
    } catch (err) {
      setError("Failed to update product");
      throw err;
    }
  };

  const deleteProduct = async (id: number) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    try {
      const success = await ProductOperations.softDelete(id, userId);
      if (success) {
        await loadProducts();
      }
      return success;
    } catch (err) {
      setError("Failed to delete product");
      throw err;
    }
  };

  const getProductById = async (id: number) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    try {
      return await ProductOperations.getById(id, userId);
    } catch (err) {
      setError("Failed to get product");
      throw err;
    }
  };

  const getProductStats = async () => {
    if (!userId) {
      return { total: 0, active: 0, lowStock: 0 };
    }
    try {
      return await ProductOperations.getStats(userId);
    } catch (err) {
      setError("Failed to get product statistics");
      throw err;
    }
  };

  useEffect(() => {
    const shouldLoad =
      isInitialized && userId && userId !== 0 && !hasLoadedRef.current;

    if (shouldLoad) {
      loadProducts();
    } else if (!isInitialized || !userId || userId === 0) {
      setLoading(false);
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
    getProductById,
    getProductStats,
  };
};

// Auth logic moved to AuthContext
