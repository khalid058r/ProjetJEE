import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useUser } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(form.email, form.password);

      // Vérification backend
      if (!user || !user.id || !user.role) {
        setError("Invalid response from server");
        return;
      }

      // Sauvegarde dans UserContext + localStorage
      loginUser(user);

      // Redirection selon rôle
      switch (user.role) {
        case "ADMIN": 
          navigate("/dashboard");
          break;

        case "VENDEUR": 
          navigate("/vendeur");
          break;

        case "ANALYSTE": 
          navigate("/analyste");
          break;

        case "ACHETEUR": 
          navigate("/acheteur");
          break;

        case "INVESTISSEUR": 
          navigate("/investisseur");
          break;

        default:
          navigate("/");
      }

    } catch (err) {
      console.log("LOGIN ERROR →", err);

      const msg =
        err?.message ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed";

      setError(msg);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <button
          onClick={() => navigate("/register")}
          className="w-full mt-4 text-blue-600 underline"
        >
          Register
        </button>

      </div>
    </div>
  );
}
