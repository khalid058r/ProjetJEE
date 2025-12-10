import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, createUser, updateUser } from "../services/userService";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "VENDEUR",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      getUser(id).then((res) => {
        setForm({
          username: res.data.username,
          email: res.data.email,
          password: "",
          role: res.data.role,
        });
      });
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isEdit) await updateUser(id, form);
      else await createUser(form);

      navigate("/users");
    } catch (err) {
      setError("Operation failed: " + (err.response?.data?.message || ""));
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 shadow rounded">
      <h1 className="text-2xl font-bold mb-5">
        {isEdit ? "Edit User" : "Add User"}
      </h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full border p-2 rounded"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border p-2 rounded"
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border p-2 rounded"
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required={!isEdit}
        />

        <select
          className="w-full border p-2 rounded"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="VENDEUR">VENDEUR</option>
          <option value="ANALYSTE">ANALYSTE</option>
          <option value="ACHETEUR">ACHETEUR</option>
          <option value="INVESTISSEUR">INVESTISSEUR</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
          type="submit"
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
