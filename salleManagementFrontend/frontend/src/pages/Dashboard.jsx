import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Award,
  User
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getSales } from "../services/salesService";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

/* =======================
   UI CARDS
======================= */
const StatsCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {trend && (
          <div className="flex items-center text-sm mt-1">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const PerformerCard = ({ title, data, icon: Icon }) => (
  <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-5 h-5" />
      <h3 className="font-semibold">{title}</h3>
    </div>
    {data ? (
      <>
        <p className="text-3xl font-bold">{data.name}</p>
        <p className="text-blue-100">{data.value} sales</p>
      </>
    ) : (
      <p className="text-blue-100">No data</p>
    )}
  </div>
);

/* =======================
   DASHBOARD
======================= */
export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [period, setPeriod] = useState("MONTH");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [s, p, c] = await Promise.all([
        getSales(),
        getProducts(),
        getCategories(),
      ]);
      setSales(s.data);
      setProducts(p.data);
      setCategories(c.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading dashboard...</p>;

  /* =======================
     FILTER PERIOD
  ======================= */
  const now = new Date();
  const filteredSales = sales.filter(s => {
    const d = new Date(s.saleDate);
    if (period === "MONTH")
      return d.getMonth() === now.getMonth();
    if (period === "YEAR")
      return d.getFullYear() === now.getFullYear();
    return true;
  });

  /* =======================
     KPI
  ======================= */
  const totalRevenue = filteredSales.reduce((s, v) => s + v.totalAmount, 0);
  const totalSales = filteredSales.length;
  const avgOrder = totalSales ? totalRevenue / totalSales : 0;
  const lowStock = products.filter(p => p.stock < 5).length;

  /* =======================
     TOP PRODUCT
  ======================= */
  const productCounter = {};
  filteredSales.forEach(s =>
    s.lignes?.forEach(l => {
      productCounter[l.productTitle] =
        (productCounter[l.productTitle] || 0) + l.quantity;
    })
  );

  const topProduct = Object.entries(productCounter)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)[0];

  /* =======================
     BEST SELLER (VENDEUR)
  ======================= */
  const sellerCounter = {};
  filteredSales.forEach(s => {
    sellerCounter[s.username] =
      (sellerCounter[s.username] || 0) + 1;
  });

  const bestSeller = Object.entries(sellerCounter)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)[0];

  /* =======================
     CATEGORY PIE DATA
  ======================= */
  const catMap = {};
  filteredSales.forEach(s =>
    s.lignes?.forEach(l => {
      const p = products.find(x => x.id === l.productId);
      const c = categories.find(x => x.id === p?.categoryId);
      if (!c) return;
      catMap[c.name] = (catMap[c.name] || 0) + l.quantity * l.unitPrice;
    })
  );

  const pieData = Object.entries(catMap).map((e, i) => ({
    name: e[0],
    value: e[1]
  }));

  /* =======================
     SALES TREND
  ======================= */
  const trendData = filteredSales.map(s => ({
    date: s.saleDate,
    revenue: s.totalAmount
  }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Business performance overview</p>
          </div>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            <option value="MONTH">This Month</option>
            <option value="YEAR">This Year</option>
            <option value="ALL">All Time</option>
          </select>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} />
          <StatsCard title="Sales" value={totalSales} icon={ShoppingCart} />
          <StatsCard title="Avg Order" value={`$${avgOrder.toFixed(2)}`} icon={TrendingUp} />
          <StatsCard title="Low Stock" value={lowStock} icon={AlertTriangle} />
        </div>

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PerformerCard title="Top Product" data={topProduct} icon={Award} />
          <PerformerCard title="Best Seller" data={bestSeller} icon={User} />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="font-semibold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="font-semibold mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
