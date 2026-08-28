"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loadData, saveData } from "@/lib/storage";

const AuthContext = createContext(null);
const CURRENT_USER_KEY = "abs_current_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(loadData(CURRENT_USER_KEY, null));
    setIsLoading(false);
  }, []);

  function loginUser(userData) {
    setUser(userData);
    saveData(CURRENT_USER_KEY, userData);
  }

  function logoutUser() {
    setUser(null);
    saveData(CURRENT_USER_KEY, null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }
  return context;
}
