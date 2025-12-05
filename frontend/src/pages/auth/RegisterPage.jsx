import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const roles = ["ADMIN", "VENDEUR", "ANALYSTE", "ACHETEUR", "INVESTISSEUR"];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "VENDEUR",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.username || !form.email || !form.password || !form.role) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Email invalide.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      setSuccess("Compte créé ! En attente de validation par un admin.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de l'inscription.";
      setError(msg);
    }
    setLoading(false);
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
            Créer un compte
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <TextField
              label="Nom utilisateur"
              name="username"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              label="Mot de passe"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              select
              label="Rôle"
              name="role"
              fullWidth
              margin="normal"
              value={form.role}
              onChange={handleChange}
            >
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "S'inscrire"}
            </Button>
          </Box>

          <Typography textAlign="center" mt={2} variant="body2">
            Déjà un compte ?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Se connecter
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
