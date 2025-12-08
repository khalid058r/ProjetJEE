import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ⛔ Temp mock — remplacer plus tard par axios.get(`/api/products/${id}`)
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fake data — replace later with backend call
    setProduct({
      id,
      title: "Apple Airpods Max",
      asin: "B08NB4Z9HD",
      price: 549.99,
      stock: 25,
      categoryName: "Electronics",
      rating: 4.7,
      reviewCount: 1832,
      imageUrl:
        "https://res.cloudinary.com/univers-cloud/image/upload/v1673531176/airpods-max.png",
      gallery: [
        "https://res.cloudinary.com/univers-cloud/image/upload/v1673531176/airpods-max.png",
        "https://res.cloudinary.com/univers-cloud/image/upload/v1673531180/airpods-side.png",
        "https://res.cloudinary.com/univers-cloud/image/upload/v1673531165/airpods-back.png",
      ],
      description:
        "The AirPods Max combine high-fidelity audio with industry-leading Active Noise Cancellation to deliver an unparalleled listening experience.",
    });
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>

        <div className="flex gap-3">
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <PencilSquareIcon className="h-6 w-6 text-blue-600" />
          </button>

          <button className="p-3 bg-gray-100 rounded-lg hover:bg-red-100 transition">
            <TrashIcon className="h-6 w-6 text-red-600" />
          </button>
        </div>
      </div>

      {/* PAGE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT — IMAGE GALLERY */}
        <div>
          <img
            src={product.imageUrl}
            className="w-full h-96 object-cover rounded-xl shadow"
          />

          {/* Thumbnails */}
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

        {/* RIGHT — PRODUCT INFO */}
        <div className="space-y-6">

          {/* PRICE */}
          <div className="text-4xl font-bold">${product.price}</div>

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
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* METADATA */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">ASIN: {product.asin}</p>
            <p className="text-sm text-gray-500">Product ID: {product.id}</p>
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
    </div>
  );
}
