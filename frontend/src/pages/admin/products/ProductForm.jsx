import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, createProduct, updateProduct } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import { uploadImage } from "../../api/uploadImage";

export default function ProductForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [form, setForm] = useState({
    asin: "",
    title: "",
    price: "",
    rating: "",
    reviewCount: "",
    rank: "",
    stock: "",
    categoryId: "",
  });

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  // Load product if editing
  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  async function loadProduct() {
    const data = await getProduct(id);
    setForm({
      asin: data.asin,
      title: data.title,
      price: data.price,
      rating: data.rating,
      reviewCount: data.reviewCount,
      rank: data.rank,
      stock: data.stock,
      categoryId: data.categoryId,
    });
    setImageUrl(data.imageUrl);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ⭐ CLOUDINARY UPLOAD
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadImage(file);
      setImageUrl(result.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      rank: Number(form.rank),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
      imageUrl: imageUrl, // <= IMPORTANT !!!
    };

    try {
      if (id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/admin/products");

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>{id ? "Edit Product" : "New Product"}</h2>

      <form onSubmit={handleSubmit}>
        <input name="asin" value={form.asin} onChange={handleChange} required />
        <input name="title" value={form.title} onChange={handleChange} required />
        <input name="price" value={form.price} onChange={handleChange} required />

        {/* Upload image */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {imageUrl && <img src={imageUrl} width="150" />}

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
