import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Package,
  Tag,
  Users,
  BarChart2,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// SERVICES
import AnalyticsService from "../../services/analyticsService";
import { getSales } from "../../services/salesService";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

// GOOGLE ANALYTICS COLORS
const GA_BLUE = "#4285f4";
const GA_BLUE_LIGHT = "#e8f0fe";
const COLORS = ["#4285f4", "#1a73e8", "#34a853", "#fbbc05", "#ea4335"];

/* ========================================================
   KPI CARD
======================================================== */
const KPICard = ({ title, value, variation, icon: Icon }) => {
  const positive = variation >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>

          {variation !== null && (
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {variation}%
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
};

/* ========================================================
   HEATMAP BUILDER
======================================================== */
function buildHeatmapMatrix(sales) {
  const matrix = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => 0)
  );

  sales.forEach((s) => {
    const d = new Date(s.saleDate);
    const day = d.getDay();
    const hour = d.getHours();
    matrix[day][hour] += s.totalAmount;
  });

  return matrix;
}

/* ========================================================
   MAIN COMPONENT
======================================================== */
export default function OverviewAnalytics() {
  const [kpi, setKpi] = useState(null);
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [hourlySales, setHourlySales] = useState([]);

  const [fallbackSales, setFallbackSales] = useState([]);
  const [heatmap, setHeatmap] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ========================================================
      LOAD ANALYTICS FIRST, FALLBACK IF ERROR
  ======================================================== */
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [kpiRes, dailyRes, monthlyRes, catRes, bestRes] = await Promise.all([
        AnalyticsService.getGlobalKpi(),
        AnalyticsService.getDailySales(),
        AnalyticsService.getMonthlySales(),
        AnalyticsService.getCategoryStats(),
        AnalyticsService.getBestSellers(5),
      ]);

      setKpi(kpiRes.data);
      setDaily(dailyRes.data);
      setMonthly(monthlyRes.data);
      setCategoryStats(catRes.data);
      setBestProducts(bestRes.data);

      // ⚠ Heatmap built from daily analytics API? → Build raw if not provided
      const salesRaw = await getSales();
      setHeatmap(buildHeatmapMatrix(salesRaw.data));

    } catch (err) {
      console.warn("⚠ Analytics API not available, switching to fallback mode", err);
      await loadFallback();
    } finally {
      setLoading(false);
    }
  };

  /* ========================================================
      FALLBACK LOCAL CALCULATION
  ======================================================== */
  const loadFallback = async () => {
    const [s, p, c] = await Promise.all([getSales(), getProducts(), getCategories()]);
    const sales = s.data;
    const products = p.data;
    const categories = c.data;

    setFallbackSales(sales);

    /* KPI */
    const totalRev = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const avgOrder = sales.length ? totalRev / sales.length : 0;

    setKpi({
      totalRevenue: totalRev,
      totalSales: sales.length,
      averageBasket: avgOrder,
      lowStockCount: products.filter((p) => p.stock < 5).length,
    });

    /* Daily */
    const dailyMap = {};
    sales.forEach((s) => {
      const d = s.saleDate.split("T")[0];
      dailyMap[d] = (dailyMap[d] || 0) + s.totalAmount;
    });
    setDaily(Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue })));

    /* Categories */
    const catMap = {};
    sales.forEach((sale) => {
      sale.lignes.forEach((l) => {
        const prod = products.find((x) => x.id === l.productId);
        if (!prod) return;
        const cat = categories.find((x) => x.id === prod.categoryId);
        if (!cat) return;

        catMap[cat.name] = (catMap[cat.name] || 0) + l.quantity * l.unitPrice;
      });
    });
    setCategoryStats(
      Object.entries(catMap).map(([categoryName, totalRevenue]) => ({
        categoryName,
        totalRevenue,
      }))
    );

    /* Best sellers */
    const prodCount = {};
    sales.forEach((s) =>
      s.lignes.forEach((l) => {
        prodCount[l.productTitle] = (prodCount[l.productTitle] || 0) + l.quantity;
      })
    );
    setBestProducts(
      Object.entries(prodCount)
        .map(([productTitle, totalQuantity]) => ({ productTitle, totalQuantity }))
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5)
    );

    /* Hourly */
    const hourMap = {};
    sales.forEach((s) => {
      const hour = new Date(s.saleDate).getHours();
      hourMap[hour] = (hourMap[hour] || 0) + s.totalAmount;
    });
    setHourlySales(
      Array.from({ length: 24 }).map((_, h) => ({
        hour: `${h}:00`,
        revenue: hourMap[h] || 0,
      }))
    );

    /* Heatmap */
    setHeatmap(buildHeatmapMatrix(sales));
  };

  /* ========================================================
      LOADING UI
  ======================================================== */
  if (loading)
    return (
      <div className="p-12 text-center text-gray-600 text-lg">
        Chargement du Dashboard Analytics…
      </div>
    );

  /* ========================================================
      UI RENDER
  ======================================================== */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* TITLE */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="text-gray-600"> Analyse globale — style Google Analytics </p>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard title="Revenue" value={`${kpi.totalRevenue.toFixed(2)} DH`} variation={12} icon={DollarSign} />
          <KPICard title="Sales" value={kpi.totalSales} variation={8} icon={ShoppingCart} />
          <KPICard title="Avg Order" value={`${kpi.averageBasket.toFixed(2)} DH`} variation={-3} icon={BarChart2} />
          <KPICard title="Low Stock" value={kpi.lowStockCount} variation={null} icon={AlertTriangle} />
        </div>

        {/* DAILY TREND */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Revenue Trend (Daily)</h2>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />

              <defs>
                <linearGradient id="gaBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GA_BLUE} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={GA_BLUE_LIGHT} stopOpacity={0} />
                </linearGradient>
              </defs>

              <Area
                dataKey="revenue"
                stroke={GA_BLUE}
                fill="url(#gaBlue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY DISTRIBUTION */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Category Contribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryStats}
                dataKey="totalRevenue"
                nameKey="categoryName"
                outerRadius={120}
                label
              >
                {categoryStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BEST PRODUCTS */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestProducts}>
              <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
              <XAxis dataKey="productTitle" />
              <Tooltip />
              <Bar dataKey="totalQuantity" fill={GA_BLUE} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* HOURLY SALES */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Sales by Hour</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlySales}>
              <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <Tooltip />

              <Bar dataKey="revenue" fill="#34a853" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* =========================================================
            HEATMAP
        ========================================================= */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Heatmap — Ventes par Heure & Jour</h2>
          <p className="text-gray-500 text-sm mb-4">
            Plus la couleur est foncée, plus le volume des ventes est élevé.
          </p>

          <div className="overflow-auto">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-xs text-gray-600">Jour / Heure</th>
                  {[...Array(24).keys()].map((h) => (
                    <th key={h} className="p-1 text-[10px] text-gray-500 text-center">
                      {h}:00
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day, row) => (
                  <tr key={row}>
                    <td className="p-2 text-xs font-medium text-gray-700">{day}</td>

                    {heatmap[row].map((value, col) => {
                      const max = Math.max(...heatmap.flat());
                      const intensity = max ? value / max : 0;

                      const color = `rgba(66,133,244, ${0.15 + intensity * 0.85})`;

                      return (
                        <td
                          key={col}
                          className="w-6 h-6 border border-gray-100 hover:scale-105 transition"
                          style={{ backgroundColor: color }}
                          title={`${day} ${col}:00 — ${value.toFixed(2)} DH`}
                        ></td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
