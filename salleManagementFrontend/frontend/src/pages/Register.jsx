import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "VENDEUR",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await registerUser(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Register</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          name="username"
          placeholder="Username"
          className="w-full border p-2 rounded mb-3"
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-3"
          onChange={handleChange}
        />

        {/* ROLE SELECTOR (except ADMIN) */}
        <select
          name="role"
          className="w-full border p-2 rounded mb-3"
          onChange={handleChange}
        >
          <option value="VENDEUR">Vendeur</option>
          <option value="ANALYSTE">Analyste</option>
          <option value="ACHETEUR">Acheteur</option>
          <option value="INVESTISSEUR">Investisseur</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-blue-600 underline"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
