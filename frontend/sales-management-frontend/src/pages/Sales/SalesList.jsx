import React, { useState, useEffect } from 'react';
import { saleService } from '../../services/saleService';
import { Trash2, Edit2, Plus } from 'lucide-react';

export const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await saleService.getAll();
      setSales(data);
    } catch (err) {
      setError('Erreur lors du chargement des ventes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
      try {
        await saleService.delete(id);
        setSales(sales.filter(s => s.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ventes</h1>
        <a href="/sales/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
          <Plus size={20} /> Nouvelle Vente
        </a>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantité</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{new Date(sale.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">{sale.client}</td>
                <td className="px-6 py-4">{sale.quantity}</td>
                <td className="px-6 py-4">${sale.total?.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <a href={`/sales/${sale.id}/edit`} className="text-blue-600 hover:text-blue-800 mr-4">
                    <Edit2 size={18} />
                  </a>
                  <button 
                    onClick={() => handleDelete(sale.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sales.length === 0 && (
          <div className="p-8 text-center text-gray-500">Aucune vente trouvée</div>
        )}
      </div>
    </div>
  );
};
