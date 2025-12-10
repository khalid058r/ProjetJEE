import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { uploadImage } from "../utils/uploadImage";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/Toast";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { getCategories } from "../services/categoryService";

export default function Products() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("none");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [preview, setPreview] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);

  const emptyForm = {
    asin: "",
    title: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
    rating: 0,
    reviewCount: 0,
    rank: 0
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      showToast("Failed to load products", "error");
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      showToast("Failed to load categories", "error");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoadingImg(true);

    const url = await uploadImage(file);
    setLoadingImg(false);

    setForm({ ...form, imageUrl: url });
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setPreview(null);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setForm({
      asin: p.asin,
      title: p.title,
      price: p.price,
      stock: p.stock,
      categoryId: p.categoryId,
      rating: p.rating || 0,
      reviewCount: p.reviewCount || 0,
      rank: p.rank || 0,
      imageUrl: p.imageUrl
    });

    setPreview(p.imageUrl);
    setEditingId(p.id);
    setShowModal(true);
  };

  const saveProduct = async () => {
    if (!form.categoryId) {
      showToast("Please select a category", "error");
      return;
    }
    if (!form.imageUrl) {
      showToast("Please upload an image", "error");
      return;
    }

    const payload = {
      asin: form.asin,
      title: form.title,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
      imageUrl: form.imageUrl,
      rating: Number(form.rating || 0),
      reviewCount: Number(form.reviewCount || 0),
      rank: Number(form.rank || 0),
    };

    try {
      if (!editingId) {
        await createProduct(payload);
        showToast("Product created");
      } else {
        await updateProduct(editingId, payload);
        showToast("Product updated");
      }

      setShowModal(false);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Error saving product", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(confirmDeleteId);
      showToast("Product deleted", "success");
      setConfirmDeleteId(null);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Cannot delete product", "error");
    }
  };

  const filtered = products
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      categoryFilter === "All" ? true : p.categoryName === categoryFilter
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "stock-asc") return a.stock - b.stock;
      if (sortBy === "stock-desc") return b.stock - a.stock;
      return 0;
    });

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" /> Add Product
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 p-3 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-lg"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All</option>
          {[...new Set(products.map((p) => p.categoryName))].map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="p-3 border rounded-lg"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="none">Sort by...</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="stock-asc">Stock: Low → High</option>
          <option value="stock-desc">Stock: High → Low</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow border rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={p.imageUrl}
              className="h-48 w-full object-cover cursor-pointer"
              onClick={() => navigate(`/products/${p.id}`)}
            />

            <div className="p-5 space-y-2">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-gray-600">${p.price}</p>
              <p className="text-gray-500 text-sm">Stock: {p.stock}</p>
              <p className="text-gray-500 text-sm">{p.categoryName}</p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <PencilSquareIcon className="h-5 w-5 text-blue-600" />
                </button>

                <button
                  onClick={() => setConfirmDeleteId(p.id)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-red-100"
                >
                  <TrashIcon className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL ADD/EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            {/* FORM FIELDS */}
            <div className="space-y-4">
              <input
                name="asin"
                value={form.asin}
                onChange={handleChange}
                placeholder="ASIN"
                className="w-full border p-2 rounded-lg"
              />

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Product title"
                className="w-full border p-2 rounded-lg"
              />

              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                placeholder="Price"
                className="w-full border p-2 rounded-lg"
              />

              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                type="number"
                placeholder="Stock"
                className="w-full border p-2 rounded-lg"
              />

              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-sm">Upload Image</label>
                <input type="file" onChange={handleImage} />

                {preview && (
                  <img
                    src={preview}
                    className="w-32 h-32 mt-3 object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={saveProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {confirmDeleteId && (
        <ConfirmModal
          title="Delete Product"
          message="This action is permanent. Continue?"
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
