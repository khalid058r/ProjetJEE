import { useState } from "react";
import {
  PlusIcon,
  TagIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCategory = () => {
    if (!form.name) return;

    const newCategory = {
      id: Date.now(),
      ...form,
    };

    setCategories([...categories, newCategory]);
    setShowModal(false);

    setForm({
      name: "",
      description: "",
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" /> Add Category
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition group"
          >
            <div className="flex items-center gap-3 mb-4">
              <TagIcon className="h-8 w-8 text-blue-600" />
              <h2 className="text-xl font-semibold">{cat.name}</h2>
            </div>

            <p className="text-gray-600 text-sm line-clamp-3">
              {cat.description || "No description provided."}
            </p>

            <div className="flex justify-end gap-3 pt-5">
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                <PencilSquareIcon className="h-5 w-5 text-blue-600" />
              </button>

              <button className="p-2 rounded-lg bg-gray-100 hover:bg-red-100">
                <TrashIcon className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">

            <h2 className="text-2xl font-semibold mb-6">Add Category</h2>

            <div className="space-y-4">

              <div>
                <label className="block text-sm mb-1">Category Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Electronics"
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
                  rows={3}
                  className="w-full border rounded-lg p-2 resize-none"
                ></textarea>
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
