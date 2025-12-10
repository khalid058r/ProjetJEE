import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon, StarIcon } from "@heroicons/react/24/solid";

import { getProduct, deleteProduct } from "../services/productService";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/Toast";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  // Load product
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await getProduct(id);
      const p = res.data;

      // If backend has only one image → generate fake gallery
      p.gallery = [
        p.imageUrl,
        p.imageUrl,
        p.imageUrl,
      ];

      setProduct(p);
    } catch (err) {
      showToast("Failed to load product", "error");
      navigate("/products");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      showToast("Product deleted successfully");
      navigate("/products");
    } catch (err) {
      showToast(err.response?.data?.message || "Cannot delete product", "error");
    }
  };

  if (!product) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/products/${id}/edit`)}
            className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <PencilSquareIcon className="h-6 w-6 text-blue-600" />
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="p-3 bg-gray-100 rounded-lg hover:bg-red-100 transition"
          >
            <TrashIcon className="h-6 w-6 text-red-600" />
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT : IMAGE */}
        <div>
          <img
            src={product.imageUrl}
            className="w-full h-96 object-cover rounded-xl shadow"
          />

          {/* Gallery */}
          <div className="flex gap-4 mt-4">
            {product.gallery.map((img, idx) => (
              <img
                key={idx}
                src={img}
                className="w-24 h-24 rounded-lg object-cover border hover:ring-2 hover:ring-blue-500 cursor-pointer transition"
                onClick={() => setProduct({ ...product, imageUrl: img })}
              />
            ))}
          </div>
        </div>

        {/* RIGHT : DETAILS */}
        <div className="space-y-6">

          {/* PRICE */}
          <div className="text-4xl font-bold text-gray-800">
            ${product.price}
          </div>

          {/* STOCK + CATEGORY */}
          <div className="flex gap-6 text-gray-700">
            <span className="px-4 py-2 bg-gray-100 rounded-lg shadow-sm">
              Stock: {product.stock}
            </span>

            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg shadow-sm">
              {product.categoryName}
            </span>
          </div>

          {/* RATING */}
          <div className="flex items-center gap-2 mt-3">
            <StarIcon className="h-6 w-6 text-yellow-500" />
            <span className="font-medium">
              {product.rating ?? 0} ({product.reviewCount ?? 0} reviews)
            </span>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              Ce produit n’a pas encore de description.  
              (Tu peux ajouter plus tard description, features, specs…)
            </p>
          </div>

          {/* METADATA */}
          <div className="pt-4 border-t text-gray-500 text-sm">
            <p>ASIN: {product.asin}</p>
            <p>Product ID: {product.id}</p>
          </div>
        </div>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/products")}
        className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
      >
        ← Back to products
      </button>

      {/* DELETE CONFIRMATION */}
      {showDelete && (
        <ConfirmModal
          title="Delete Product"
          message="This action cannot be undone. Delete this product?"
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
