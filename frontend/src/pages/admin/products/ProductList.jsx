import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../../api/productApi";
import { useNavigate } from "react-router-dom";
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await deleteProduct(id);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <Button variant="contained" onClick={() => navigate("/admin/products/new")}>
        Add Product
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ASIN</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.asin}</TableCell>
              <TableCell>{p.title}</TableCell>
              <TableCell>{p.price} MAD</TableCell>
              <TableCell>{p.categoryName}</TableCell>

              <TableCell>
                <Button onClick={() => navigate(`/admin/products/edit/${p.id}`)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(p.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
