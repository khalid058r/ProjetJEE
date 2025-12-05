import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import AdminLayout from "../layouts/AdminLayout";

// Pages Admin
import Dashboard from "../pages/admin/Dashboard";
import CategoryList from "../pages/admin/categories/CategoryList";
import ProductList from "../pages/admin/products/ProductList";
import CategoryForm from "../pages/admin/categories/CategoryForm";
import ProductForm from "../pages/admin/products/ProductForm";



const AppRouter = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/edit/:id" element={<CategoryForm />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/new" element={<ProductForm />} />
        <Route path="/admin/products/edit/:id" element={<ProductForm />} />

        </Route>

      {/* Default */}
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRouter;
