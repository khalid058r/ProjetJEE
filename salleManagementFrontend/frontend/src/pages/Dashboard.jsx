import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  // Fake data for charts
  const categoryData = [
    { name: "Electronics", value: 40, color: "#3b82f6" },
    { name: "Books", value: 25, color: "#10b981" },
    { name: "Home", value: 20, color: "#8b5cf6" },
    { name: "Clothing", value: 15, color: "#f59e0b" },
  ];

  const lineData = [10, 20, 15, 25, 35, 32, 45, 40, 55, 60, 70, 80];

  const barData = [
    { name: "Product A", revenue: 12000 },
    { name: "Product B", revenue: 9000 },
    { name: "Product C", revenue: 7000 },
    { name: "Product D", revenue: 5000 },
  ];

  const sparkA = [10, 12, 8, 15, 20, 18, 25];
  const sparkB = [50, 55, 58, 60, 65, 70, 75];

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm">{new Date().toDateString()}</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Revenue */}
        <StatCard
          title="Revenue"
          value="$39,403,450"
          icon={<CurrencyDollarIcon className="h-8 w-8 text-blue-600" />}
        />

        {/* Sales */}
        <StatCard
          title="Total Sales"
          value="10,243"
          icon={<ChartBarIcon className="h-8 w-8 text-green-600" />}
        />

        {/* Customers */}
        <StatCard
          title="Customers"
          value="8,120"
          icon={<UsersIcon className="h-8 w-8 text-purple-600" />}
        />

        {/* Alerts */}
        <StatCard
          title="Stock Alerts"
          value="12"
          icon={<ExclamationTriangleIcon className="h-8 w-8 text-red-600" />}
        />
      </div>

      {/* 2 COLUMN CHART LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* CUSTOM BAR CHART */}
        <SalesBarChart />

        {/* CATEGORY DONUT CHART */}
        <DonutChart data={categoryData} />
      </div>

      {/* LINE CHART + SPARKLINES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <LineChart data={lineData} />

        <SparkCard title="User Growth" data={sparkA} color="blue" />
        <SparkCard title="Sales Growth" data={sparkB} color="green" />
      </div>

      {/* HORIZONTAL BAR CHART */}
      <TopProductsChart data={barData} />

    </div>
  );
}

/* ===========================================
            COMPONENTS
=========================================== */

// 🔹 KPI CARD
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center gap-4">
      <div className="bg-gray-100 p-3 rounded-xl">{icon}</div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

// 🔹 SALES BAR CHART
function SalesBarChart() {
  const values = [40, 80, 60, 100, 30, 45, 90, 70, 50, 110, 95, 120];

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>

      <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-end gap-2 p-6">
        {values.map((h, i) => (
          <div
            key={i}
            className="w-5 bg-blue-500 rounded-t-xl opacity-80"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </div>
  );
}

// 🔹 DONUT CHART
function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let cumulative = 0;
  const circles = data.map((d) => {
    const start = (cumulative / total) * 100;
    const end = ((cumulative + d.value) / total) * 100;
    cumulative += d.value;
    return { ...d, start, end };
  });

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>

      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {circles.map((slice, index) => (
            <circle
              key={index}
              r="16"
              cx="18"
              cy="18"
              fill="transparent"
              stroke={slice.color}
              strokeWidth="4"
              strokeDasharray={`${slice.end - slice.start} ${100 - (slice.end - slice.start)}`}
              strokeDashoffset={-slice.start}
            />
          ))}
        </svg>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ background: d.color }}></span>
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🔹 LINE CHART
function LineChart({ data }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Sales Over Time</h2>

      <svg viewBox="0 0 200 100" className="w-full h-32 stroke-blue-600 fill-blue-200">
        <polyline
          fill="none"
          strokeWidth="3"
          points={data.map((v, i) => `${(i / data.length) * 200},${100 - v}`).join(" ")}
        />
      </svg>
    </div>
  );
}

// 🔹 SPARKLINE MINICHARTS
function SparkCard({ title, data, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-semibold mb-2">{data[data.length - 1]}</p>

      <svg viewBox="0 0 200 60" className={`w-full stroke-${color}-600`}>
        <polyline
          fill="none"
          strokeWidth="3"
          points={data.map((v, i) => `${(i / data.length) * 200},${60 - v}`).join(" ")}
        />
      </svg>
    </div>
  );
}

// 🔹 HORIZONTAL BAR CHART
function TopProductsChart({ data }) {
  const max = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Top Product Revenues</h2>

      <div className="space-y-4">
        {data.map((p) => (
          <div key={p.name}>
            <div className="flex justify-between">
              <p>{p.name}</p>
              <p className="text-gray-500">${p.revenue}</p>
            </div>
            <div className="h-3 bg-gray-200 rounded-lg mt-1">
              <div
                className="h-3 bg-green-500 rounded-lg"
                style={{ width: `${(p.revenue / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
