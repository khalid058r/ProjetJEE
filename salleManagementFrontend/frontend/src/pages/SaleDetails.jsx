import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { getSale } from "../services/salesService";
import { generateInvoicePDF } from "../utils/invoicePdf";


export default function SaleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSale();
  }, [id]);

  const loadSale = async () => {
    try {
      setLoading(true);

      const res = await getSale(id);
      let saleData = { ...res.data };

      // ✅ Infos frontend (client, cart)
      const extra = JSON.parse(localStorage.getItem(`sale-extra-${id}`));
      if (extra) {
        saleData.clientName = extra.clientName;
        saleData.cart = extra.cart;
        saleData.total = extra.total;
      } else {
        saleData.clientName = "Walk-in Customer";
        saleData.cart = saleData.lignes; // fallback backend
        saleData.total = saleData.totalAmount;
      }

      setSale(saleData);
    } catch (err) {
      console.error(err);
      setError("Failed to load sale details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-10">Loading sale...</p>;
  if (error) return <p className="text-center text-red-500 p-10">{error}</p>;

 
  return (
    <div className="space-y-10 animate-fadeIn">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/sales")}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>

        <h1 className="text-3xl font-bold">Sale #{sale.id}</h1>

      <button
        onClick={() => generateInvoicePDF(sale)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Download PDF
      </button>
      </div>

      {/* SALE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* INFO */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Sale Information</h2>
          <p><strong>Date:</strong> {sale.saleDate}</p>
          <p><strong>Client:</strong> {sale.clientName}</p>
          <p className="mt-2">
            <strong>Status:</strong>{" "}
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
              {sale.status}
            </span>
          </p>
          <p className="text-2xl font-bold mt-4">
            Total: ${sale.total.toFixed(2)}
          </p>
        </div>

        {/* DONUT */}
        <SaleDonutChart lignes={sale.lignes} />

        {/* ITEMS */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Total Items</h2>
          <p className="text-4xl font-bold">
            {sale.lignes.reduce((s, l) => s + l.quantity, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================
   DONUT CHART
============================ */
function SaleDonutChart({ lignes }) {
  const total = lignes.reduce((s, l) => s + l.quantity, 0);
  let offset = 0;
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-xl font-semibold mb-4">Product Distribution</h2>
      <svg viewBox="0 0 36 36" className="w-44 h-44 mx-auto">
        {lignes.map((l, i) => {
          const pct = (l.quantity / total) * 100;
          const circle = (
            <circle
              key={i}
              r="16"
              cx="18"
              cy="18"
              fill="transparent"
              stroke={colors[i % colors.length]}
              strokeWidth="4"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={-offset}
            />
          );
          offset += pct;
          return circle;
        })}
      </svg>
    </div>
  );
}
