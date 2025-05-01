// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { loginUser } from "../utils/api";
import { setAuthToken, removeAuthToken } from "../utils/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
      // Here you could add a function to verify the token with your backend
        setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      setUser(response.data);
      setIsAuthenticated(true);
      setAuthToken(response.token); // Assuming your backend returns a token
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeAuthToken();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
