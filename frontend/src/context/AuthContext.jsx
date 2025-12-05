import React, { createContext, useContext, useEffect, useState } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis localStorage une seule fois
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid stored user", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []); // important: pas d'appel API ici

  // Fonction login (appelée UNIQUEMENT sur clic bouton)
  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const loggedUser = response.data;

    if (!loggedUser.active) {
      throw new Error("Votre compte n'est pas encore activé par un administrateur.");
    }

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    return loggedUser;
  };

  // Fonction register
  const register = async (data) => {
    const response = await authApi.register(data);
    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
};
