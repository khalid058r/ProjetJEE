import { useEffect, useState } from "react";
import {
  getKpi,
  getMonthlySales,
  getDailySales,
  getBestSellers,
  getLowStock,
  getCategoryStats,
  getGrowth
} from "../../services/analyticsService";

import EnhancedStatsCard from "../../components/analytics/EnhancedStatsCard";
import EnhancedSalesChart from "../../components/analytics/EnhancedSalesChart";
import TopProductsChart from "../../components/analytics/TopProductsChart";
import EnhancedCategoryPieChart from "../../components/analytics/EnhancedCategoryPieChart";
import LowStockAlert from "../../components/analytics/LowStockAlert";

export default function Overview() {
  const [kpi, setKpi] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [daily, setDaily] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [categories, setCategories] = useState([]);
  const [growth, setGrowth] = useState(null);

  useEffect(() => {
    async function load() {
      const k = await getKpi();
      const m = await getMonthlySales();
      const d = await getDailySales("2025-01-01", "2025-12-31");
      const best = await getBestSellers(5);
      const low = await getLowStock(5);
      const cat = await getCategoryStats();
      const gr = await getGrowth();

      setKpi(k.data);
      setMonthly(m.data.list);
      setDaily(d.data);
      setTopProducts(best.data);
      setLowStock(low.data);
      setCategories(cat.data);
      setGrowth(gr.data);
    }

    load();
  }, []);

  if (!kpi) return <p className="p-8 text-center">Loading analytics...</p>;

  return (
    <div className="space-y-10 p-6">

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <EnhancedStatsCard title="Revenue Total" value={`${kpi.sales.totalRevenue} MAD`} color="blue" />
        <EnhancedStatsCard title="Revenue du Mois" value={`${kpi.sales.currentMonthRevenue} MAD`} color="green" />
        <EnhancedStatsCard title="Total Ventes" value={kpi.sales.salesCount} color="purple" />
        <EnhancedStatsCard title="Panier Moyen" value={`${kpi.sales.averageBasket} MAD`} color="orange" />
        <EnhancedStatsCard title="Best Category" value={kpi.performance.bestCategory} color="pink" />
        <EnhancedStatsCard title="Best Seller" value={kpi.performance.bestSellerProduct} color="red" />
      </div>

      {/* MAIN CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Revenue Mensuel</h2>
          <EnhancedSalesChart sales={monthly} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Répartition par Catégorie</h2>
          <EnhancedCategoryPieChart data={categories} />
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Top Produits</h2>
        <TopProductsChart products={topProducts} />
      </div>

      {/* LOW STOCK */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Stock Critique</h2>
        <LowStockAlert products={lowStock} />
      </div>
    </div>
  );
}
