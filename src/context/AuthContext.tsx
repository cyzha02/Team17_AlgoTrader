import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../ApiCalls/ApiService";
import { TradingCredentials } from "../types/trading";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  login: (credentials: TradingCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Check for stored credentials on mount
    const storedUserId = localStorage.getItem("userId");
    const storedPassword = localStorage.getItem("password");

    if (storedUserId && storedPassword) {
      const credentials: TradingCredentials = {
        user_id: Number(storedUserId),
        password: storedPassword,
      };

      ApiService.setCredentials(credentials);
      ApiService.authenticate().then((success) => {
        if (success) {
          setIsAuthenticated(true);
          setUserId(Number(storedUserId));
        } else {
          // Clear invalid stored credentials
          localStorage.removeItem("userId");
          localStorage.removeItem("password");
        }
      });
    }
  }, []);

  const login = async (credentials: TradingCredentials) => {
    try {
      ApiService.setCredentials(credentials);
      const success = await ApiService.authenticate();

      if (success) {
        setIsAuthenticated(true);
        setUserId(credentials.user_id);
        // Store credentials
        localStorage.setItem("userId", credentials.user_id.toString());
        localStorage.setItem("password", credentials.password);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("password");
    ApiService.setCredentials({ user_id: 0, password: "" });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
