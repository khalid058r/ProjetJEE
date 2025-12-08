import { useState } from "react";
import {
  UserPlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function Users() {
  const [showModal, setShowModal] = useState(false);

  const [users, setUsers] = useState([
    // Exemple statique — remplacé plus tard avec backend
    { id: 1, username: "admin", email: "admin@gmail.com", role: "ADMIN", active: true },
    { id: 2, username: "khalid", email: "khalid@gmail.com", role: "VENDEUR", active: false },
  ]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "VENDEUR",
  });

  const roles = ["ADMIN", "VENDEUR", "ANALYSTE", "ACHETEUR"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addUser = () => {
    if (!form.username || !form.email || !form.password) return;

    const newUser = {
      id: Date.now(),
      ...form,
      active: false,
    };

    setUsers([...users, newUser]);
    setShowModal(false);

    setForm({
      username: "",
      email: "",
      password: "",
      role: "VENDEUR",
    });
  };

  const toggleActive = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, active: !u.active } : u
      )
    );
  };

  const deleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <UserPlusIcon className="h-5 w-5" /> Add User
        </button>
      </div>

      {/* USERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition"
          >
            {/* Fake Avatar */}
            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-xl font-bold text-blue-700 mx-auto">
              {u.username.charAt(0).toUpperCase()}
            </div>

            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold">{u.username}</h2>
              <p className="text-gray-500">{u.email}</p>
              <p className="mt-2 text-sm font-medium text-gray-700">{u.role}</p>

              {/* STATUS */}
              <div className="mt-3 flex items-center justify-center gap-2">
                {u.active ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 text-sm">Active</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-5 w-5 text-red-600" />
                    <span className="text-red-700 text-sm">Inactive</span>
                  </>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => toggleActive(u.id)}
                className={`px-4 py-2 rounded-lg text-white font-medium transition
                  ${u.active ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
              >
                {u.active ? "Deactivate" : "Activate"}
              </button>

              <button
                onClick={() => deleteUser(u.id)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 transition"
              >
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

            <h2 className="text-2xl font-semibold mb-6">Add User</h2>

            <div className="space-y-4">

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full border rounded-lg p-2"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                className="w-full border rounded-lg p-2"
              />

              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                type="password"
                className="w-full border rounded-lg p-2"
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

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
                onClick={addUser}
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
