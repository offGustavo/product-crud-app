import React, { createContext, useContext, useEffect, useState } from "react";
import { UserOperations } from "../database/operations";
import { User, UserFormData } from "../types";
import * as Crypto from "expo-crypto";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: UserFormData) => Promise<number>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  isInitialized: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  isInitialized,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const register = async (userData: UserFormData): Promise<number> => {
    if (!isInitialized) {
      throw new Error("Database not initialized");
    }

    try {
      setLoading(true);

      // Check if email already exists
      const existingUser = await UserOperations.getByEmail(userData.email);
      if (existingUser) {
        throw new Error("Email already registered");
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

  const login = async (email: string, password: string): Promise<User> => {
    if (!isInitialized) {
      throw new Error("Database not initialized");
    }

    try {
      setLoading(true);
      const user = await UserOperations.verifyCredentials(email, password);
      if (!user) {
        throw new Error("Invalid email or password");
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

  const checkExistingUsers = async () => {
    if (!isInitialized) return;

    try {
      const users = await UserOperations.getAll();
    } catch (error) {
      console.error("Error checking existing users:", error);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      checkExistingUsers();
    }
  }, [isInitialized]);

  const value: AuthContextType = {
    currentUser,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
