import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("ricardo_token"));
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshWallet = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.getWallet(token);
      setWallet(data);
    } catch (err) {
      logout();
    }
  }, [token]);

  useEffect(() => {
    if (token) refreshWallet();
  }, [token, refreshWallet]);

  const login = async (phone, password) => {
    setLoading(true);
    try {
      const data = await api.login({ phone, password });
      localStorage.setItem("ricardo_token", data.token);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await api.register(payload);
      localStorage.setItem("ricardo_token", data.token);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("ricardo_token");
    setToken(null);
    setWallet(null);
  };

  return (
    <AuthContext.Provider value={{ token, wallet, loading, login, register, logout, refreshWallet }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
