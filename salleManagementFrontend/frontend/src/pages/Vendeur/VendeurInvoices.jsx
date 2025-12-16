import { useEffect, useState } from "react";
import { getSales } from "../../services/salesService";
import { useToast } from "../../components/Toast";
import { DocumentTextIcon, EyeIcon } from "@heroicons/react/24/outline";
import { generateInvoicePDF } from "../../utils/invoicePdf";
import { useNavigate } from "react-router-dom";

export default function VendeurInvoices() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const { showToast } = useToast();
  const navigate = useNavigate();

  const loadSales = async () => {
    try {
      const res = await getSales();
      setSales(res.data);
    } catch {
      showToast("Failed to load sales", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleGenerateInvoice = async (sale) => {
    try {
      await generateInvoicePDF(sale);
      showToast("Invoice generated successfully", "success");
    } catch {
      showToast("Failed to generate invoice", "error");
    }
  };

  const handleBulkExport = async () => {
    try {
      const filtered = getFilteredSales();
      for (const sale of filtered) {
        await generateInvoicePDF(sale);
      }
      showToast(`Generated ${filtered.length} invoices`, "success");
    } catch {
      showToast("Failed to generate invoices", "error");
    }
  };

  const getFilteredSales = () => {
    const now = new Date();
    return sales.filter((s) => {
      const saleDate = new Date(s.saleDate);
      if (filter === "MONTH") {
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      }
      if (filter === "YEAR") {
        return saleDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filtered = getFilteredSales();

  if (loading) {
    return (
      <div className="p-16 text-center text-xl text-gray-500 animate-pulse">
        Loading invoices...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Invoices & Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage invoices for your sales</p>
        </div>

        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
          onClick={handleBulkExport}
        >
          <DocumentTextIcon className="h-5 w-5" /> Export All
        </button>
      </div>

      {/* FILTER */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white shadow-sm font-medium"
        >
          <option value="ALL">All Time</option>
          <option value="MONTH">This Month</option>
          <option value="YEAR">This Year</option>
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Invoices</p>
          <p className="text-3xl font-bold mt-1">{filtered.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold mt-1">
            ${filtered.reduce((sum, s) => sum + s.totalAmount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Average Sale</p>
          <p className="text-3xl font-bold mt-1">
            ${filtered.length ? (filtered.reduce((sum, s) => sum + s.totalAmount, 0) / filtered.length).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* INVOICES LIST */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Invoice #</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono">INV-{s.id}</td>
                <td className="p-3">{new Date(s.saleDate).toLocaleDateString()}</td>
                <td className="p-3">{s.username}</td>
                <td className="p-3 font-semibold">${s.totalAmount.toFixed(2)}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-sm">
                    {s.status}
                  </span>
                </td>
                <td className="p-3 text-right flex justify-end gap-2">
                  <button
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                    onClick={() => navigate(`/vendeur/sales/${s.id}`)}
                    title="View Details"
                  >
                    <EyeIcon className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    className="p-2 bg-gray-100 rounded hover:bg-green-100"
                    onClick={() => handleGenerateInvoice(s)}
                    title="Generate Invoice PDF"
                  >
                    <DocumentTextIcon className="w-5 h-5 text-green-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-16 text-center text-gray-500">
            No invoices found for the selected period
          </div>
        )}
      </div>
    </div>
  );
}
