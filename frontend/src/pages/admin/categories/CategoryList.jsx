import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../../api/categoryApi";
import { Link } from "react-router-dom";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@mui/material";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      loadCategories(); // refresh
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div>
      <h2>Catégories</h2>

      <Link to="/admin/categories/new">
        <Button variant="contained" color="primary">
          Nouvelle catégorie
        </Button>
      </Link>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.id}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.description}</TableCell>
              <TableCell>
                <Link to={`/admin/categories/edit/${cat.id}`}>
                  <Button variant="outlined">Modifier</Button>
                </Link>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(cat.id)}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryList;
