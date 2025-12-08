// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger l'utilisateur depuis localStorage au démarrage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Fonctions utilitaires pour vérifier les rôles
  const isAdmin = () => user?.role === 'ADMIN';
  const isVendeur = () => user?.role === 'VENDEUR';
  const isAnalyste = () => user?.role === 'ANALYSTE';
  const isAcheteur = () => user?.role === 'ACHETEUR';
  const isInvestisseur = () => user?.role === 'INVESTISSEUR';
  const canManageSales = () => isAdmin() || isVendeur();
  const canManageUsers = () => isAdmin();

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin,
    isVendeur,
    isAnalyste,
    isAcheteur,
    isInvestisseur,
    canManageSales,
    canManageUsers,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};