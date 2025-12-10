import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCategory,
  getCategoryProducts,
} from "../services/categoryService";

import {
  TagIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  // Search + sort
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const load = async () => {
    try {
      const res = await getCategory(id);
      setCategory(res.data);

      const p = await getCategoryProducts(id);
      setProducts(p.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!category) return <p>Loading...</p>;

  /* -------------------------------------------
      KPI CALCULATIONS
  -------------------------------------------- */
  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const avgPrice =
    totalProducts > 0
      ? (products.reduce((s, p) => s + (p.price || 0), 0) / totalProducts).toFixed(2)
      : 0;

  const bestSeller = products.reduce(
    (max, p) => (p.salesCount > (max?.salesCount || 0) ? p : max),
    null
  );

  /* -------------------------------------------
      FILTERED + SORTED PRODUCTS
  -------------------------------------------- */
  const filtered = products
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "stock") return a.stock - b.stock;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* -----------------------------------------
          HEADER
      ------------------------------------------ */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <TagIcon className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-4xl font-bold">{category.name}</h1>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* -----------------------------------------
          KPI CARDS
      ------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <KpiCard title="Total Products" value={totalProducts} />

        <KpiCard
          title="Total Stock"
          value={totalStock}
        />

        <KpiCard
          title="Average Price"
          value={`$${avgPrice}`}
        />

        <KpiCard
          title="Best Seller"
          value={bestSeller ? bestSeller.title : "—"}
        />

      </div>

      {/* -----------------------------------------
          SEARCH + SORT
      ------------------------------------------ */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        
        {/* Search */}
        <div className="relative w-full">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg shadow-sm"
          />
        </div>

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded-lg shadow-sm"
        >
          <option value="name">Sort: Name</option>
          <option value="price">Price (Low→High)</option>
          <option value="stock">Stock (Low→High)</option>
        </select>
      </div>

      {/* -----------------------------------------
          PRODUCT LIST
      ------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition cursor-pointer"
            onClick={() => navigate(`/products/${p.id}`)}
          >
            <img
              src={p.imageUrl}
              className="h-40 w-full object-cover rounded-lg mb-3 bg-gray-100"
              alt={p.title}
            />

            <h2 className="text-lg font-semibold">{p.title}</h2>

            <p className="text-gray-600">${p.price}</p>
            <p className="text-sm text-gray-500">Stock: {p.stock}</p>

            {p.salesCount !== undefined && (
              <p className="text-xs text-green-600 mt-1">
                ⭐ {p.salesCount} sales
              </p>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-gray-500 text-center">
            No products found
          </p>
        )}

      </div>
    </div>
  );
}

/* -----------------------------------------
    KPI CARD COMPONENT
------------------------------------------ */
function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
