import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import { createSale } from "../services/salesService";
import { useToast } from "./Toast";
import { useUser } from "../context/UserContext";
import { XMarkIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function SaleFormModal({ onClose, onSave }) {
  const { showToast } = useToast();
  const { user } = useUser();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState("");


  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load products", "error");
    }
  };

  // ➕ Ajouter produit au cart
  const addToCart = () => {
    if (!selectedProduct) {
      showToast("Please select a product", "error");
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);

    if (!product) return;

    if (quantity > product.stock) {
      showToast("Not enough stock available", "error");
      return;
    }

    // Empêcher doublon
    if (cart.some((l) => l.productId === selectedProduct)) {
      showToast("This product is already in the sale", "warning");
      return;
    }

    setCart([
      ...cart,
      {
        productId: product.id,
        productTitle: product.title,
        quantity,
        unitPrice: product.price,
        lineTotal: product.price * quantity,
        maxStock: product.stock,
      },
    ]);

    // Reset
    setSelectedProduct(null);
    setQuantity(1);
    setSearch("");
  };

  // ✏ Modifier quantité dans le tableau
  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) return;

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          if (newQty > item.maxStock) {
            showToast("Not enough stock available", "error");
            return item;
          }

          return {
            ...item,
            quantity: newQty,
            lineTotal: newQty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  // 🗑 Supprimer ligne
  const removeLine = (productId) => {
    setCart(cart.filter((l) => l.productId !== productId));
  };

  // Total global
  const total = cart.reduce((sum, l) => sum + l.lineTotal, 0);

  const handleCreateSale = async () => {
    if (!user || !user.id) return showToast("Please login again", "error");
    if (cart.length === 0) return showToast("Add at least one product", "error");

    const payload = {
      userId: user.id,
      clientName: clientName,
      lignes: cart.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
      })),
    };

    try {
      setLoading(true);
      await createSale(payload);
      showToast("Sale created successfully!", "success");
      onSave && onSave();
      localStorage.setItem(
        `sale-extra-${response.data.id}`,
        JSON.stringify({
          clientName,
          cart,
          total,
          date: new Date().toISOString()
        })
      );
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Error creating sale", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 animate-fadeIn">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Sale</h2>
          <button className="p-2 hover:bg-gray-100 rounded-xl" onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        {/* CLIENT NAME FIELD */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-600">Client Name</label>
            <input
              type="text"
              placeholder="Enter client name..."
              className="w-full p-3 border rounded-lg mt-1"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search product..."
          className="w-full p-3 border rounded-lg mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* PRODUCT LIST */}
        <div className="max-h-52 overflow-auto border rounded-lg mb-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-50 ${
                selectedProduct === p.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelectedProduct(p.id)}
            >
              <img src={p.imageUrl} className="w-14 h-14 rounded-lg border" />
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-500">
                  ${p.price} • Stock: {p.stock}
                </p>
              </div>

              {selectedProduct === p.id && (
                <CheckIcon className="w-6 h-6 text-blue-600" />
              )}
            </div>
          ))}
        </div>

        {/* QUANTITY + ADD */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border p-3 rounded-lg w-32"
          />

          <button
            onClick={addToCart}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>

        {/* CART TABLE */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-inner mb-6">
          <h3 className="font-semibold mb-3">Sale Lines</h3>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm">No products added yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 text-sm">
                  <th className="p-2">Product</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Unit Price</th>
                  <th className="p-2">Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {cart.map((l) => (
                  <tr key={l.productId} className="border-t">
                    <td className="p-2">{l.productTitle}</td>

                    {/* Editable quantity */}
                    <td className="p-2">
                      <input
                        type="number"
                        min={1}
                        value={l.quantity}
                        onChange={(e) =>
                          updateQuantity(l.productId, Number(e.target.value))
                        }
                        className="w-16 p-1 border rounded"
                      />
                    </td>

                    <td className="p-2">${l.unitPrice}</td>
                    <td className="p-2 font-semibold">
                      ${l.lineTotal.toFixed(2)}
                    </td>

                    <td className="p-2">
                      <TrashIcon
                        className="w-5 h-5 text-red-500 cursor-pointer"
                        onClick={() => removeLine(l.productId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p className="text-right font-bold text-lg mt-3">
            Total: ${total.toFixed(2)}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleCreateSale}
            disabled={cart.length === 0 || loading}
            className={`px-5 py-2 rounded-lg text-white shadow ${
              cart.length > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Saving..." : "Confirm Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
