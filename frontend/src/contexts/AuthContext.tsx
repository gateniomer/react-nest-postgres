import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api, ValidationError } from "../utils/api"; // Adjust path as needed

// Types
interface User {
  userId: number;
  username: string;
  role: "admin" | "user";
}

interface LoginResult {
  success: boolean;
  message?: string;
  errors?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const userData: User = await api.get<User>("/auth/profile", {
        noRedirect: true,
      });
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<LoginResult> => {
    try {
      // Use noRedirect option to handle login failures gracefully
      await api.post(
        "/auth/login",
        { username, password },
        { noRedirect: true }
      );

      // Refresh user data after successful login
      await checkAuthStatus();

      return { success: true };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          success: false,
          message: "Validation failed",
          errors: error.errors,
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
