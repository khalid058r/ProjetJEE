import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import { saleService } from '../services/saleService';
import { BarChart3, Package, Tag, ShoppingCart } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    sales: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [categories, products, sales] = await Promise.all([
        categoryService.getAll(),
        productService.getAll(),
        saleService.getAll()
      ]);

      const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);

      setStats({
        categories: categories.length,
        products: products.length,
        sales: sales.length,
        totalRevenue: totalRevenue.toFixed(2)
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <Icon className="text-gray-400" size={40} />
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Tag} 
          label="Catégories" 
          value={stats.categories} 
          color="border-blue-500"
        />
        <StatCard 
          icon={Package} 
          label="Produits" 
          value={stats.products} 
          color="border-green-500"
        />
        <StatCard 
          icon={ShoppingCart} 
          label="Ventes" 
          value={stats.sales} 
          color="border-purple-500"
        />
        <StatCard 
          icon={BarChart3} 
          label="Chiffre d'Affaires" 
          value={`$${stats.totalRevenue}`} 
          color="border-orange-500"
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/categories" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center">
            <p className="font-semibold text-blue-600">📁 Catégories</p>
          </a>
          <a href="/products" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center">
            <p className="font-semibold text-green-600">📦 Produits</p>
          </a>
          <a href="/sales" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center">
            <p className="font-semibold text-purple-600">🛒 Ventes</p>
          </a>
          <a href="/users" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-center">
            <p className="font-semibold text-orange-600">👥 Utilisateurs</p>
          </a>
        </div>
      </div>
    </div>
  );
};
