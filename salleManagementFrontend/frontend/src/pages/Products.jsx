import { useState } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { uploadImage } from "../utils/uploadImage";
import { useNavigate } from "react-router-dom";

import { useToast } from "../components/Toast";
import { useEffect } from "react";

import ConfirmModal from "../components/ConfirmModal";


export default function Products() {
  const navigate = useNavigate();
  const categoryList = ["All", "Electronics", "Books", "Home", "Clothing"];

  // Fake products (backend later)
  const [products, setProducts] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("none");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Product Form
  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));

    setLoading(true);
    const url = await uploadImage(file);
    setLoading(false);

    setForm({ ...form, imageUrl: url });
  };

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      ...form,
    };

    setProducts([...products, newProduct]);
    setShowModal(false);

    setForm({
      title: "",
      price: "",
      stock: "",
      category: "",
      imageUrl: "",
    });
    setPreview(null);
  };

  // ⭐ APPLY SEARCH + FILTERS + SORTING ⭐
  const filteredProducts = products
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      categoryFilter === "All" ? true : p.category === categoryFilter
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
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" /> Add Product
        </button>
      </div>

      {/* 🔍 SEARCH + FILTERS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category filter */}
        <select
          className="p-3 border rounded-lg shadow-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categoryList.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* Sorting */}
        <select
          className="p-3 border rounded-lg shadow-sm"
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

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl active:scale-[0.98] transition cursor-pointer"
          >
            <img
              src={p.imageUrl}
              alt={p.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-5 space-y-2">
              <h2 className="text-lg font-semibold">{p.title}</h2>

              <p className="text-gray-600">${p.price}</p>
              <p className="text-sm text-gray-500">Stock: {p.stock}</p>
              <p className="text-sm text-gray-500">Category: {p.category}</p>

              <div className="flex justify-end gap-3 pt-3 pointer-events-none">
                {/* Buttons are disabled visually because the card is clickable */}
                <button className="p-2 rounded-lg bg-gray-100">
                  <PencilSquareIcon className="h-5 w-5 text-blue-600" />
                </button>

                <button className="p-2 rounded-lg bg-gray-100">
                  <TrashIcon className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* MODAL CREATE PRODUCT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">

            <h2 className="text-2xl font-semibold mb-6">Add Product</h2>

            <div className="space-y-4">
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
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option value="">Select category</option>
                {categoryList
                  .filter((cat) => cat !== "All")
                  .map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
              </select>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="block text-sm mb-1">Upload Image</label>
                <input type="file" onChange={handleImage} />

                {preview && (
                  <img
                    src={preview}
                    className="w-32 h-32 object-cover rounded-lg mt-3 border"
                  />
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={addProduct}
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
