import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  BarChart2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import AnalyticsService from "../../services/analyticsService";
import { getSales } from "../../services/salesService";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

// COLORS
const GA_BLUE = "#4285f4";
const GA_GREEN = "#34a853";
const GA_YELLOW = "#fbbc05";
const GA_RED = "#ea4335";
const COLORS = [GA_BLUE, GA_GREEN, GA_YELLOW, GA_RED, "#1a73e8"];

/* ===============================================================
   KPI CARD
================================================================*/
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

/* ===============================================================
   HEATMAP BUILDER
================================================================*/
function buildHeatmapMatrix(sales) {
  const matrix = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => 0)
  );
  sales.forEach((s) => {
    const d = new Date(s.saleDate);
    matrix[d.getDay()][d.getHours()] += s.totalAmount;
  });
  return matrix;
}

/* ===============================================================
   MAIN COMPONENT — PRODUCT ANALYTICS DASHBOARD
================================================================*/
export default function ProductAnalytics() {
  const [kpi, setKpi] = useState(null);
  const [daily, setDaily] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [lifecycle, setLifecycle] = useState([]);
  const [priceHistogram, setPriceHistogram] = useState([]);
  const [hourlySales, setHourlySales] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [productMatrix, setProductMatrix] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ===============================================================
      LOAD ANALYTICS FIRST (FALLBACK TO RAW SALES IF NEEDED)
  ================================================================*/
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [
        kpiRes,
        dailyRes,
        catRes,
        bestRes,
        lifecycleRes,
        pricesRes,
        hourlyRes,
        salesRes,
        prodRes,
      ] = await Promise.all([
        AnalyticsService.getGlobalKpi(),
        AnalyticsService.getDailySales(),
        AnalyticsService.getCategoryStats(),
        AnalyticsService.getBestSellers(5),
        AnalyticsService.getProductLifecycle(),
        AnalyticsService.getPriceHistogram(),
        AnalyticsService.getHourlySales(),
        getSales(),
        getProducts(),
      ]);

      setKpi(kpiRes.data);
      setDaily(dailyRes.data);
      setCategoryStats(catRes.data);
      setBestProducts(bestRes.data);
      setLifecycle(lifecycleRes.data);
      setPriceHistogram(pricesRes.data);
      setHourlySales(hourlyRes.data);
      setHeatmap(buildHeatmapMatrix(salesRes.data));

      buildProductMatrix(salesRes.data, prodRes.data);
    } catch (e) {
      console.warn("Analytics API incomplete — fallback mode", e);
      await fallbackLoad();
    } finally {
      setLoading(false);
    }
  };

  /* ===============================================================
      FALLBACK MODE (CALCULATE EVERYTHING LOCALLY)
  ================================================================*/
  const fallbackLoad = async () => {
    const [salesRes, prodRes, catRes] = await Promise.all([
      getSales(),
      getProducts(),
      getCategories(),
    ]);

    const sales = salesRes.data;
    const products = prodRes.data;
    const categories = catRes.data;

    const totalRevenue = sales.reduce((s, v) => s + v.totalAmount, 0);
    const avgOrder = sales.length ? totalRevenue / sales.length : 0;

    setKpi({
      totalRevenue,
      totalSales: sales.length,
      averageBasket: avgOrder,
      lowStockCount: products.filter((p) => p.stock < 5).length,
    });

    const dailyMap = {};
    sales.forEach((s) => {
      const d = s.saleDate.split("T")[0];
      dailyMap[d] = (dailyMap[d] || 0) + s.totalAmount;
    });
    setDaily(Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue })));

    const catMap = {};
    sales.forEach((s) =>
      s.lignes.forEach((l) => {
        const p = products.find((x) => x.id === l.productId);
        if (!p) return;
        const c = categories.find((x) => x.id === p.categoryId);
        if (!c) return;
        catMap[c.name] = (catMap[c.name] || 0) + l.quantity * l.unitPrice;
      })
    );
    setCategoryStats(
      Object.entries(catMap).map(([categoryName, totalRevenue]) => ({
        categoryName,
        totalRevenue,
      }))
    );

    const productCount = {};
    sales.forEach((s) =>
      s.lignes.forEach((l) => {
        productCount[l.productTitle] =
          (productCount[l.productTitle] || 0) + l.quantity;
      })
    );
    setBestProducts(
      Object.entries(productCount)
        .map(([productTitle, totalQuantity]) => ({ productTitle, totalQuantity }))
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5)
    );

    const hourly = {};
    sales.forEach((s) => {
      const h = new Date(s.saleDate).getHours();
      hourly[h] = (hourly[h] || 0) + s.totalAmount;
    });
    setHourlySales(
      Array.from({ length: 24 }).map((_, h) => ({
        hour: `${h}:00`,
        revenue: hourly[h] || 0,
      }))
    );

    setHeatmap(buildHeatmapMatrix(sales));

    buildProductMatrix(sales, products);
  };

  /* ===============================================================
      PRODUCT PERFORMANCE MATRIX BUILDER
  ================================================================*/
  const buildProductMatrix = (sales, products) => {
    const map = {};

    sales.forEach((s) =>
      s.lignes.forEach((l) => {
        if (!map[l.productId]) {
          map[l.productId] = {
            id: l.productId,
            title: l.productTitle,
            qty: 0,
            revenue: 0,
            price: l.unitPrice,
          };
        }
        map[l.productId].qty += l.quantity;
        map[l.productId].revenue += l.quantity * l.unitPrice;
      })
    );

    setProductMatrix(Object.values(map));
  };

  /* ===============================================================
      LOADING UI
  ================================================================*/
  if (loading)
    return (
      <div className="p-10 text-center text-gray-600 text-lg">
        Chargement des analyses produits…
      </div>
    );

  /* ===============================================================
      MAIN UI
  ================================================================*/
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* TITLE */}
        <h1 className="text-3xl font-bold">Product Analytics</h1>
        <p className="text-gray-600">Analyse complète des performances produits</p>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Revenue"
            value={`${kpi.totalRevenue.toFixed(2)} DH`}
            variation={12}
            icon={DollarSign}
          />
          <KPICard title="Sales" value={kpi.totalSales} variation={6} icon={ShoppingCart} />
          <KPICard
            title="Avg Basket"
            value={`${kpi.averageBasket.toFixed(2)} DH`}
            variation={-2}
            icon={BarChart2}
          />
          <KPICard title="Low Stock" value={kpi.lowStockCount} variation={null} icon={AlertTriangle} />
        </div>

        {/* DAILY TREND */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Daily Revenue Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <Tooltip />
              <Area dataKey="revenue" stroke={GA_BLUE} fill="#e8f0fe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY PIE */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Category Contribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryStats} dataKey="totalRevenue" nameKey="categoryName" outerRadius={120}>
                {categoryStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BEST PRODUCTS */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productTitle" />
              <Tooltip />
              <Bar dataKey="totalQuantity" fill={GA_BLUE} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PRODUCT PERFORMANCE MATRIX */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Product Performance Matrix</h2>
          <p className="text-gray-500 text-sm mb-4">
            Visualisation globale du catalogue : vitesse de vente, revenue et positionnement.
          </p>

          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="qty" name="Quantité" />
              <YAxis type="number" dataKey="revenue" name="Revenue" />
              <Tooltip formatter={(v) => v.toFixed(2)} />
              <Scatter
                data={productMatrix}
                fill={GA_BLUE}
                shape="circle"
                size={(d) => Math.max(20, d.price * 1.5)}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* HOURLY SALES */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Hourly Sales</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <Tooltip />
              <Bar dataKey="revenue" fill={GA_GREEN} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* HEATMAP */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Sales Heatmap (Jour × Heure)</h2>

          <div className="overflow-auto">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-xs text-gray-600">Jour / Heure</th>
                  {Array.from({ length: 24 }).map((_, h) => (
                    <th key={h} className="p-1 text-[10px] text-gray-500">
                      {h}:00
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day, r) => (
                  <tr key={r}>
                    <td className="p-2 text-xs font-medium text-gray-700">{day}</td>
                    {heatmap[r].map((value, c) => {
                      const max = Math.max(...heatmap.flat());
                      const intensity = max ? value / max : 0;
                      const color = `rgba(66,133,244, ${0.12 + intensity * 0.88})`;
                      return (
                        <td
                          key={c}
                          className="w-6 h-6 border border-gray-100"
                          style={{ backgroundColor: color }}
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
