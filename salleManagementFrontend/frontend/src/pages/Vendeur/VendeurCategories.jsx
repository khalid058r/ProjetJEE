import { useEffect, useState } from "react";
import {
  PlusIcon,
  TagIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../../services/categoryService";

import { useNavigate } from "react-router-dom";

export default function VendeurCategories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ---------------------------------
  // LOAD CATEGORIES FROM BACKEND
  // ---------------------------------
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("ERROR LOADING CATEGORIES:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ---------------------------------
  // CREATE CATEGORY
  // ---------------------------------
  const addCategory = async () => {
    if (!form.name) return;

    try {
      await createCategory(form);
      setShowModal(false);

      // Reset form
      setForm({ name: "", description: "" });

      // Reload list
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------
  // DELETE CATEGORY
  // ---------------------------------
  const removeCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Categories Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" /> Add Category
        </button>
      </div>

      {/* GRID */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition group cursor-pointer"
              onClick={() => navigate(`/vendeur/categories/${cat.id}`)}
            >
              <div className="flex items-center gap-3 mb-4">
                <TagIcon className="h-8 w-8 text-blue-600" />
                <h2 className="text-xl font-semibold">{cat.name}</h2>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3">
                {cat.description || "No description provided."}
              </p>

              <div className="flex justify-end gap-3 pt-5">
                <button
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <PencilSquareIcon className="h-5 w-5 text-blue-600" />
                </button>

                <button
                  className="p-2 rounded-lg bg-gray-100 hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(cat.id);
                  }}
                >
                  <TrashIcon className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">
              No categories
            </p>
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">

            <h2 className="text-2xl font-semibold mb-6">Add Category</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Electronics"
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Optional description..."
                  className="w-full border rounded-lg p-2 resize-none"
                  rows={3}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={addCategory}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
