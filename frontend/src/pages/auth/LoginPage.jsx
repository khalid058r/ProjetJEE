import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.from?.pathname || "/admin/dashboard";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation locale (important pour éviter 400)
    if (!form.email || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Email invalide.");
      return;
    }

    setSubmitting(true);

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Email ou mot de passe incorrect.";

      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420, p: 1 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" fontWeight={600} mb={2}>
            Connexion
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Mot de passe"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, py: 1.2 }}
              disabled={submitting}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Se connecter"
              )}
            </Button>
          </Box>

          <Typography textAlign="center" mt={2} variant="body2">
            Pas de compte ?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Créer un compte
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
