import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategory,
  getCategory,
  updateCategory,
} from "../../../api/categoryApi";


const CategoryForm = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState(""); // NEW
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      getCategory(id).then((res) => setForm(res.data));
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isEdit) {
        await updateCategory(id, form);
      } else {
        await createCategory(form);
      }

      navigate("/admin/categories");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 409) {
        setError("Une catégorie avec ce nom existe déjà.");
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {isEdit ? "Edit Category" : "New Category"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
            />

            <Button variant="contained" type="submit">
              {isEdit ? "Update" : "Create"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default CategoryForm;
