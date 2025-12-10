import { useEffect, useState } from "react";
import { getSales } from "../services/salesService";
import { getProducts } from "../services/productService";
import StatsCard from "../components/charts/StatsCard";
import SalesChart from "../components/charts/SalesChart";
import RecentSalesTable from "../components/RecentSalesTable";
import LowStockTable from "../components/LowStockTable";

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const salesRes = await getSales();
    const productRes = await getProducts();

    setSales(salesRes.data);
    setProducts(productRes.data);
  };

  const revenue = sales.reduce(
    (sum, s) => sum + s.totalAmount,
    0
  );

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Sales" value={sales.length} />
        <StatsCard title="Revenue" value={`${revenue.toFixed(2)} MAD`} />
        <StatsCard title="Products" value={products.length} />
        <StatsCard
          title="Low Stock"
          value={products.filter(p => p.stock < 5).length}
          danger
        />
      </div>

      {/* CHART */}
      <SalesChart sales={sales} />

      {/* TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSalesTable sales={sales.slice(0, 5)} />
        <LowStockTable products={products} />
      </div>
    </div>
  );
}
