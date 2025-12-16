import { useEffect, useState } from "react";
import { getSales, deleteSale } from "../../services/salesService";
import { useToast } from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { PlusIcon, TrashIcon, EyeIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import SaleFormModal from "../../components/SaleFormModal";
import { generateInvoicePDF } from "../../utils/invoicePdf";

export default function VendeurSales() {
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const res = await getSales();
      setSales(res.data);
    } catch (err) {
      showToast("Failed to load sales", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteSale(confirmDeleteId);
      showToast("Sale deleted", "success");
      setConfirmDeleteId(null);
      loadSales();
    } catch {
      showToast("Cannot delete sale", "error");
    }
  };

  const handleGenerateInvoice = async (sale) => {
    try {
      await generateInvoicePDF(sale);
      showToast("Invoice generated successfully", "success");
    } catch (err) {
      showToast("Failed to generate invoice", "error");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Sales Management</h1>

        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          <PlusIcon className="h-5 w-5" /> New Sale
        </button>
      </div>

      {/* SALES LIST */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full border bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.username}</td>
                <td className="p-3">{s.saleDate}</td>
                <td className="p-3">${s.totalAmount.toFixed(2)}</td>
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
                    title="Generate Invoice"
                  >
                    <DocumentTextIcon className="w-5 h-5 text-green-600" />
                  </button>
                  <button
                    className="p-2 bg-gray-100 rounded hover:bg-red-100"
                    onClick={() => setConfirmDeleteId(s.id)}
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL NEW SALE */}
      {showModal && <SaleFormModal onClose={() => setShowModal(false)} onSave={loadSales} />}

      {/* CONFIRM DELETE */}
      {confirmDeleteId && (
        <ConfirmModal
          title="Delete Sale"
          message="Are you sure you want to delete this sale?"
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
