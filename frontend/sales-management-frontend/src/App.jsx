// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

// Pages d'authentification
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Pages Admin
import { Dashboard } from './pages/Dashboard';
import { CategoryList } from './pages/Categories/CategoryList';
import { CategoryForm } from './pages/Categories/CategoryForm';
import { ProductList } from './pages/Products/ProductList';
import { ProductForm } from './pages/Products/ProductForm';
import { UserList } from './pages/Users/UserList';
import { UserForm } from './pages/Users/UserForm';
import { SalesList } from './pages/Sales/SalesList';
import { SalesForm } from './pages/Sales/SalesForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Catégories */}
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/new" element={<CategoryForm />} />
            <Route path="/categories/:id/edit" element={<CategoryForm />} />
            
            {/* Produits */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />
            
            {/* Utilisateurs */}
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id/edit" element={<UserForm />} />
            
            {/* Ventes */}
            <Route path="/sales" element={<SalesList />} />
            <Route path="/sales/new" element={<SalesForm />} />
            <Route path="/sales/:id/edit" element={<SalesForm />} />
          </Route>

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Route 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-4">Page non trouvée</p>
                <a href="/" className="text-blue-600 hover:underline">
                  Retour à l'accueil
                </a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;